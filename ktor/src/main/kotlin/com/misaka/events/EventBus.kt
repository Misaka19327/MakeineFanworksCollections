package com.misaka.events

import com.misaka.schema.UserEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.slf4j.LoggerFactory
import java.util.concurrent.Executors

interface HandleableEvent {
    suspend fun handle()
}

object EventBus {
    private val logger = LoggerFactory.getLogger(EventBus::class.java)
    private var eventScope: CoroutineScope = CoroutineScope(Dispatchers.Default)

    fun init(workerCount: Int) {
        val dispatcher = Executors.newFixedThreadPool(workerCount).asCoroutineDispatcher()
        eventScope = CoroutineScope(dispatcher)
        logger.info("EventBus initialized with $workerCount workers.")
    }

    suspend fun publish(event: HandleableEvent, isAsync: Boolean = true) {
        if (isAsync) {
            eventScope.launch {
                try {
                    event.handle()
                } catch (e: Exception) {
                    logger.error("Error handling async event ${event::class.simpleName}", e)
                }
            }
        } else {
            try {
                event.handle()
            } catch (e: Exception) {
                logger.error("Error handling sync event ${event::class.simpleName}", e)
            }
        }
    }
}

// Events

data class UserRegistered(val user: UserEntity) : HandleableEvent {
    override suspend fun handle() {
        // Example logic: Log the registration
        LoggerFactory.getLogger(this::class.java).info("User registered: ${user.nickname} (${user.email})")
    }
}

data class UserLoggedIn(val user: UserEntity) : HandleableEvent {
    override suspend fun handle() {
        // Example logic: Log the login
        LoggerFactory.getLogger(this::class.java).info("User logged in: ${user.nickname}")
    }
}
