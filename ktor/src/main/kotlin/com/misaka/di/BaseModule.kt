package com.misaka.di

import com.misaka.enums.LoggerType
import io.ktor.server.application.*
import io.ktor.server.config.ApplicationConfig
import io.lettuce.core.RedisClient
import io.lettuce.core.api.StatefulRedisConnection
import io.lettuce.core.api.async.RedisAsyncCommands
import io.lettuce.core.api.sync.RedisCommands
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.DatabaseConfig
import org.jetbrains.exposed.sql.SqlLogger
import org.koin.core.qualifier.named
import org.koin.dsl.module
import org.slf4j.Logger
import org.slf4j.LoggerFactory

val BaseModule = module {
    LoggerType.entries.forEach { loggerType ->
        single (named(loggerType)) {
            LoggerFactory.getLogger(loggerType.name)
        }
    }

    single<Database> {
        val config = get<ApplicationConfig>()
        val url = config.property("database.url").getString()
        val user = config.property("database.username").getString()
        val password = config.property("database.password").getString()
        val driver = config.propertyOrNull("database.driver")?.getString() ?: "org.postgresql.Driver"

        val logger by inject<Logger>(named(LoggerType.SqlLogger))

        Database.connect(
            url = url,
            user = user,
            driver = driver,
            password = password,
            databaseConfig = DatabaseConfig {
                sqlLogger = logger as SqlLogger
            }
        )
    }

    single<StatefulRedisConnection<String, String>> {
        val config = get<ApplicationConfig>()
        val host = config.propertyOrNull("redis.default.host")?.getString() ?: "localhost"
        val port = config.propertyOrNull("redis.default.port")?.getString() ?: "6379"
        val password = config.propertyOrNull("redis.default.password")?.getString()
        val db = config.propertyOrNull("redis.default.db")?.getString() ?: "0"

        val redisUrl = if (password.isNullOrBlank()) {
            "redis://$host:$port/$db"
        } else {
            "redis://:$password@$host:$port/$db"
        }

        val client = RedisClient.create(redisUrl)
        client.connect()
    }

    // 同步api
    single<RedisCommands<String, String>> {
        get<StatefulRedisConnection<String, String>>().sync()
    }

    // 异步api
    single<RedisAsyncCommands<String, String>> {
        get<StatefulRedisConnection<String, String>>().async()
    }
}