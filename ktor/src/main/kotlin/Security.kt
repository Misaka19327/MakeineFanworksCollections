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
 * 配置安全相关的功能
 * 包括JWT认证等安全机制
 */
fun Application.configureSecurity() {
    // JWT配置参数
    // 注意：在生产环境中应该从配置文件中读取这些值
    val jwtAudience = "jwt-audience"                // JWT的目标受众
    val jwtDomain = "https://jwt-provider-domain/"  // JWT发行者域名
    val jwtRealm = "ktor sample app"                // JWT领域
    val jwtSecret = "secret"                        // JWT签名密钥

    // 配置认证机制
    authentication {
        // 配置JWT认证
        jwt {
            realm = jwtRealm  // 设置认证领域
            
            // 配置JWT验证器
            verifier(
                JWT
                    .require(Algorithm.HMAC256(jwtSecret))  // 使用HMAC256算法和密钥
                    .withAudience(jwtAudience)              // 设置目标受众
                    .withIssuer(jwtDomain)                  // 设置发行者
                    .build()
            )

            // 验证JWT凭证
            validate { credential ->
                // 检查JWT的受众是否匹配
                if (credential.payload.audience.contains(jwtAudience)) {
                    JWTPrincipal(credential.payload)  // 验证成功，返回JWT主体
                } else {
                    null  // 验证失败，返回null
                }
            }
        }
    }
}
