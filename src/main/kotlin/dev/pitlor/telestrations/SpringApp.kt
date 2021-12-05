package dev.pitlor.telestrations

import dev.pitlor.gamekit_spring_boot_starter.implementations.User
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.annotation.SendToUser
import org.springframework.messaging.simp.annotation.SubscribeMapping
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.ModelAttribute
import java.util.*

@Configuration
open class Factories {
    @Bean
    open fun playerFactory(): (UUID, MutableMap<String, Any>) -> TelestrationsPlayer {
        return ::TelestrationsPlayer
    }

    @Bean
    open fun gameFactory(): (String, UUID) -> TelestrationsGame {
        return ::TelestrationsGame
    }
}

@Controller
class ServerController(private val server: TelestrationsServer, private val socket: SimpMessagingTemplate) {
    @SubscribeMapping("/games/orphaned")
    fun getOrphanedGames(): Iterable<String> {
        return server.getOrphanedGameCodes()
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