package com.misaka

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.mongodb.kotlin.client.coroutine.MongoClient
import com.ucasoft.ktor.simpleCache.SimpleCache
import com.ucasoft.ktor.simpleCache.cacheOutput
import com.ucasoft.ktor.simpleMemoryCache.*
import com.ucasoft.ktor.simpleRedisCache.*
import dev.inmo.krontab.builder.*
import io.github.flaxoos.ktor.server.plugins.taskscheduling.*
import io.github.flaxoos.ktor.server.plugins.taskscheduling.managers.lock.database.*
import io.github.flaxoos.ktor.server.plugins.taskscheduling.managers.lock.redis.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.engine.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlin.random.Random
import kotlin.time.Duration.Companion.seconds
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

/**
 * 配置HTTP相关的功能
 * 包括CORS、缓存、Swagger文档等
 */
fun Application.configureHTTP() {
    // 配置CORS（跨域资源共享）
    install(CORS) {
        // 允许的HTTP方法
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        // 允许的HTTP头
        allowHeader(HttpHeaders.Authorization)
        allowHeader("MyCustomHeader")
        // 允许所有主机访问（生产环境建议限制）
        anyHost() // @TODO: Don't do this in production if possible. Try to limit it.
    }

    // 配置Swagger UI，用于API文档
    routing {
        swaggerUI(path = "openapi")
    }

    // 配置缓存系统
    // 注释掉的是Redis缓存配置
    /*
    install(SimpleCache) {
        redisCache {
            invalidateAt = 10.seconds
            host = "localhost"
            port = 6379
        }
    }
    */

    // 使用内存缓存替代Redis
    install(SimpleCache) {
        memoryCache {
            invalidateAt = 10.seconds
        }
    }

    // 配置带缓存的路由
    routing {
        // 短期缓存示例（2秒）
        cacheOutput(2.seconds) {
            get("/short") {
                call.respond(Random.nextInt().toString())
            }
        }

        // 默认缓存示例（使用配置的10秒）
        cacheOutput {
            get("/default") {
                call.respond(Random.nextInt().toString())
            }
        }
    }
}
