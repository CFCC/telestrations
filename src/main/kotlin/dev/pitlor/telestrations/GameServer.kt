package dev.pitlor.telestrations

import dev.pitlor.gamekit_spring_boot_starter.implementations.Game
import dev.pitlor.gamekit_spring_boot_starter.implementations.Player
import dev.pitlor.gamekit_spring_boot_starter.implementations.Server
import dev.pitlor.gamekit_spring_boot_starter.interfaces.IGameRepository
import org.springframework.stereotype.Component
import java.util.*

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
class TelestrationsPlayer(
    id: UUID,
    settings: MutableMap<String, Any>,
) : Player(id, settings) {
    val notebookQueue: List<Notebook> = arrayListOf()
}
class TelestrationsGame(
    code: String,
    adminId: UUID,
) : Game<TelestrationsPlayer>(code, adminId) {
    val isDone: Boolean get() = players.all {
        it.notebookQueue.size == 1
            && it.notebookQueue[0].originalOwnerId == it.id
            && it.notebookQueue[0].pages.size > 1
    }
}

@Component
open class TelestrationsServer(
    private val gameRepository: IGameRepository<TelestrationsPlayer, TelestrationsGame>,
    gameFactory: (code: String, adminId: UUID) -> TelestrationsGame,
    playerFactory: (id: UUID, settings: MutableMap<String, Any>) -> TelestrationsPlayer
) : Server<TelestrationsPlayer, TelestrationsGame>(gameRepository, gameFactory, playerFactory) {
    fun startGame(gameCode: String, userId: UUID) {
        val game = gameRepository.safeGetByCode(gameCode, withAdmin = userId)
        game.isActive = true
    }

    fun writeInPage(gameCode: String, userId: UUID, content: String) {
        val game = gameRepository.safeGetByCode(gameCode)
        val player = game.safeGetPlayer(userId)

        require(player.notebookQueue.isNotEmpty()) { "You have no notebooks in your queue" }
        player.notebookQueue.first().let {
            it.ensureLastPageIsBy(userId)
            it.pages.last().content = content
        }
    }

    fun submitPage(gameCode: String, userId: UUID, content: String?): String {
        val game = gameRepository.safeGetByCode(gameCode)
        val player = game.safeGetPlayer(userId)

        require(player.notebookQueue.isNotEmpty()) { "You have no notebooks in your queue" }
        player.notebookQueue.first().let {
            it.ensureLastPageIsBy(userId)
            if (content != null) it.pages.last().content = content
        }

        return "Page submitted"
    }

    fun getOrphanedGameCodes(): Iterable<String> {
        return gameRepository
            .findAll {
                val player = it.players.find { p -> p.id == it.adminId }
                return@findAll player?.startOfTimeOffline != null
            }
            .map { it.code }
    }
}
