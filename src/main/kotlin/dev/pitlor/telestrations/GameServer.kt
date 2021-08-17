package dev.pitlor.telestrations

import dev.pitlor.gamekit_spring_boot_starter.Game
import dev.pitlor.gamekit_spring_boot_starter.Server
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.LocalDateTime
import java.util.*
import kotlin.collections.ArrayList

const val SETTING_CONNECTED = "connected"

val games = arrayListOf<TelestrationsGame>()
val mutex = Mutex()

data class Page(val type: String, val authorId: UUID, var content: String = "", val id: UUID = UUID.randomUUID())
data class Notebook(val originalOwnerId: UUID, val pages: ArrayList<Page> = arrayListOf()) {
    fun ensureLastPageIsBy(authorId: UUID) {
        val lastPage = pages.last()

        if (lastPage.authorId != authorId) {
            val nextPageType = if (lastPage.type == "text") "image" else "text"
            pages.add(Page(nextPageType, authorId))
        }
    }
}
data class Player(
    val id: UUID,
    val settings: MutableMap<String, Any>,
    val notebookQueue: List<Notebook> = arrayListOf(),
    var startOfTimeOffline: LocalDateTime? = null
) {
    fun isAdminOf(gameCode: String): Boolean {
        val game = games.find { it.code == gameCode } ?: return false
        return game.admin.settings["id"] == this.id.toString()
    }
}
data class TelestrationsGame(
    val code: String,
    var admin: Player,
    val players: ArrayList<Player> = arrayListOf(),
    var active: Boolean = false
) : Game {
    val isDone: Boolean get() = players.all {
        it.notebookQueue.size == 1
            && it.notebookQueue[0].originalOwnerId == it.id
            && it.notebookQueue[0].pages.size > 1
    }
}

object TelestrationsServer : Server {
    private fun getPlayer(code: String, user: UUID): Pair<Player, TelestrationsGame> {
        val game = games.find { it.code == code }
        val player = game?.players?.find { it.id == user }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(player != null) { "That player is not in this game" }

        return Pair(player, game)
    }

    override fun findCodeOfGameWithPlayer(id: UUID): String? {
        return games.find { g -> !g.isDone && g.players.any { p -> p.id == id } }?.code
    }

    override fun getGameCodes(): List<String> {
        return games
            .filter { !it.active }
            .map { it.code }
//        val orphaned = games
//            .filter {
//                val oneMinuteAgo = LocalDateTime.now().minusMinutes(1)
//                val abandonedTime = it.admin.startOfTimeOffline
//                return@filter abandonedTime?.isBefore(oneMinuteAgo) ?: false
//            }
//            .map { it.code }
    }

    override fun getGame(gameCode: String): TelestrationsGame {
        val game = games.find { it.code == gameCode }

        require(game != null) { "That game does not exist" }

        return game
    }

    override fun createGame(gameCode: String, adminUserId: UUID): String {
        require(gameCode.isNotEmpty()) { "Code is empty" }
        require(games.firstOrNull { it.code == gameCode } == null) { "That game code is already in use" }

        games += TelestrationsGame(gameCode, Player(adminUserId, TODO()))

        return "Game \"${gameCode}\" Created"
    }

    override fun joinGame(gameCode: String, userId: UUID, settings: MutableMap<String, Any>) {
        val game = games.find { it.code == gameCode }

        require(gameCode.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(game.players.find { it.id == userId } == null) { "You are already in that game!" }

        settings[SETTING_CONNECTED] = true
        val player = Player(userId, settings)
        game.players += player
    }

    override fun updateSettings(gameCode: String, userId: UUID, newSettings: MutableMap<String, Any>) {
        val (player, _) = getPlayer(gameCode, userId)

        player.settings.putAll(newSettings)

        if (newSettings[SETTING_CONNECTED] == true) {
            player.startOfTimeOffline = null
        } else if (newSettings[SETTING_CONNECTED] == false) {
            player.startOfTimeOffline = LocalDateTime.now()
        }
    }

    fun startGame(gameCode: String, userId: UUID) {
        val (player, game) = getPlayer(gameCode, userId)

        require(player.isAdminOf(gameCode)) { "You are not the admin of this game" }

        game.active = true
    }

    override suspend fun becomeAdmin(gameCode: String, userId: UUID): String {
        val (player, game) = getPlayer(gameCode, userId)

        mutex.withLock {
            check(game.players.find { it.id == game.admin.id }?.startOfTimeOffline == null) { "Someone already claimed the admin spot" }
            game.admin = player
        }

        return "You are now the game admin"
    }

    fun writeInPage(gameCode: String, userId: UUID, content: String) {
        val (player) = getPlayer(gameCode, userId)

        require(player.notebookQueue.isNotEmpty()) { "You have no notebooks in your queue" }

        player.notebookQueue.first().let {
            it.ensureLastPageIsBy(userId)
            it.pages.last().content = content
        }
    }

    fun submitPage(gameCode: String, userId: UUID, content: String?): String {
        val (player) = getPlayer(gameCode, userId)

        require(player.notebookQueue.isNotEmpty()) { "You have no notebooks in your queue" }

        player.notebookQueue.first().let {
            it.ensureLastPageIsBy(userId)
            if (content != null) it.pages.last().content = content
        }

        return "Page submitted"
    }
}

@Configuration
open class Beans {
    @Bean
    open fun getServer(): TelestrationsServer {
        return TelestrationsServer
    }
}