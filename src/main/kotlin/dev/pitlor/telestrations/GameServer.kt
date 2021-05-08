package dev.pitlor.telestrations

import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.time.LocalDateTime
import java.util.*
import kotlin.collections.ArrayList

const val SETTING_CONNECTED = "connected"

val games = arrayListOf<Game>()
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
)
data class Game(
    val code: String,
    var adminId: UUID,
    val players: ArrayList<Player> = arrayListOf(),
    var active: Boolean = false
) {
    val isDone: Boolean get() = players.all {
        it.notebookQueue.size == 1
            && it.notebookQueue[0].originalOwnerId == it.id
            && it.notebookQueue[0].pages.size > 1
    }
}

class Server {
    private fun getPlayer(code: String, user: UUID): Pair<Player, Game> {
        val game = games.find { it.code == code }
        val player = game?.players?.find { it.id == user }

        require(code.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(player != null) { "That player is not in this game" }

        return Pair(player, game)
    }

    fun findPlayer(userId: UUID): String? {
        return games.find { g -> !g.isDone && g.players.any { p -> p.id == userId } }?.code
    }

    fun getGames(): Iterable<String> {
        return games.filter { !it.active }.map { it.code }
    }

    fun getGame(gameCode: String): Game {
        val game = games.find { it.code == gameCode }

        require(game != null) { "That game does not exist" }

        return game
    }

    fun createGame(gameCode: String, userId: UUID): String {
        require(gameCode.isNotEmpty()) { "Code is empty" }
        require(games.firstOrNull { it.code == gameCode } == null) { "That game code is already in use" }

        games += Game(gameCode, userId)

        return "Game \"${gameCode}\" Created"
    }

    fun joinGame(gameCode: String, userId: UUID, settings: MutableMap<String, Any>) {
        val game = games.find { it.code == gameCode }

        require(gameCode.isNotEmpty()) { "Code is empty" }
        require(game != null) { "That game does not exist" }
        require(game.players.find { it.id == userId } == null) { "You are already in that game!" }

        settings[SETTING_CONNECTED] = true
        val player = Player(userId, settings)
        game.players += player
    }

    fun updateSettings(gameCode: String, userId: UUID, settings: MutableMap<String, Any>) {
        val (player, _) = getPlayer(gameCode, userId)

        player.settings.putAll(settings)

        if (settings[SETTING_CONNECTED] == true) {
            player.startOfTimeOffline = null
        } else if (settings[SETTING_CONNECTED] == false) {
            player.startOfTimeOffline = LocalDateTime.now()
        }
    }

    fun startGame(gameCode: String, userId: UUID) {
        val (_, game) = getPlayer(gameCode, userId)

        require(game.adminId == userId) { "You are not the admin of this game" }

        game.active = true
    }

    suspend fun becomeAdmin(gameCode: String, userId: UUID): String {
        val (_, game) = getPlayer(gameCode, userId)

        mutex.withLock {
            check(game.players.find { it.id == game.adminId }?.startOfTimeOffline == null) { "Someone already claimed the admin spot" }
            game.adminId = userId
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