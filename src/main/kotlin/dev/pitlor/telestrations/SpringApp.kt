package dev.pitlor.telestrations

import dev.pitlor.gamekit_spring_boot_starter.User
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.annotation.SendToUser
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.ModelAttribute

data class GamesResponse(val notActive: Iterable<String>, val orphaned: Iterable<String>)

@Controller
class ServerController(private val server: TelestrationsServer, private val socket: SimpMessagingTemplate) {
    @SubscribeMapping("/games/{gameCode}")
    fun getGame(@DestinationVariable gameCode: String): TelestrationsGame {
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/create")
    @SendToUser("/topic/successes")
    fun createGame(@DestinationVariable gameCode: String, @ModelAttribute user: User): String {
        val response = server.createGame(gameCode, user.id)
        socket.convertAndSend("/topic/games", server.getGames())
        return response
    }

    @MessageMapping("/games/{gameCode}/join")
    @SendTo("/topic/games/{gameCode}")
    fun joinGame(
        @DestinationVariable gameCode: String,
        @Payload settings: MutableMap<String, Any>,
        @ModelAttribute user: User
    ): TelestrationsGame {
        server.joinGame(gameCode, user.id, settings)
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/update")
    @SendTo("/topic/games/{gameCode}")
    fun updateSettings(
        @DestinationVariable gameCode: String,
        @Payload settings: MutableMap<String, Any>,
        @ModelAttribute user: User
    ): TelestrationsGame {
        server.updateSettings(gameCode, user.id, settings)
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/start")
    @SendTo("/topic/games/{gameCode}")
    fun startPlay(@DestinationVariable gameCode: String, @ModelAttribute user: User): TelestrationsGame {
        server.startGame(gameCode, user.id)
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/page/write")
    @SendTo("/topic/games/{gameCode}")
    fun writeInPage(
        @DestinationVariable gameCode: String,
        @ModelAttribute user: User,
        @Payload content: String
    ): TelestrationsGame {
        server.writeInPage(gameCode, user.id, content)
        return server.getGame(gameCode)
    }

    @MessageMapping("/games/{gameCode}/page/submit")
    @SendToUser("/topic/successes")
    fun submitPage(
        @DestinationVariable gameCode: String,
        @ModelAttribute user: User,
        @Payload content: String?
    ): String {
        val response = server.submitPage(gameCode, user.id, content)
        socket.convertAndSend("/topic/games/$gameCode", server.getGame(gameCode))
        return response
    }
}

@SpringBootApplication
open class TelestrationsApplication

fun main(args: Array<String>) {
    runApplication<TelestrationsApplication>(*args)
}