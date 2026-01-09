package com.misaka.plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.misaka.schema.UserEntity
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.authentication
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.response.respond
import java.util.Date

/**
 * JWT Token 生成器
 * 负责生成 Access Token 和 Refresh Token
 */
object JwtTokenGenerator {
    private lateinit var domain: String
    private lateinit var audience: String
    private lateinit var secret: String
    private var accessExpiration: Long = 3600000 // 1 hour
    private var refreshExpiration: Long = 86400000 // 24 hours

    /**
     * 初始化 JWT 配置
     * 必须在使用前调用
     */
    fun init(
        domain: String,
        audience: String,
        secret: String,
        accessExpiration: Long = 3600000,
        refreshExpiration: Long = 86400000
    ) {
        this.domain = domain
        this.audience = audience
        this.secret = secret
        this.accessExpiration = accessExpiration
        this.refreshExpiration = refreshExpiration
    }

    /**
     * 生成 Access Token
     * @param user 用户实体
     * @return JWT Access Token 字符串
     */
    fun generateAccessToken(user: UserEntity): String {
        return JWT.create()
            .withAudience(audience)
            .withIssuer(domain)
            .withClaim("uuid", user.id.value.toString())
            .withExpiresAt(Date(System.currentTimeMillis() + accessExpiration))
            .sign(Algorithm.HMAC256(secret))
    }

    /**
     * 生成 Refresh Token
     * @param user 用户实体
     * @return JWT Refresh Token 字符串
     */
    fun generateRefreshToken(user: UserEntity): String {
        return JWT.create()
            .withAudience(audience)
            .withIssuer(domain)
            .withClaim("uuid", user.id.value.toString())
            .withClaim("type", "refresh") // 区分 refresh token
            .withExpiresAt(Date(System.currentTimeMillis() + refreshExpiration))
            .sign(Algorithm.HMAC256(secret))
    }
}

/**
 * 配置 JWT 认证插件
 * 设置 Access Token、Refresh Token 以及可选认证的验证逻辑
 */
suspend fun Application.configureAuthenticationJwt() {
    install(Authentication)

    val config = environment.config

    val jwtDomain = config.propertyOrNull("jwt.domain")?.getString() ?: ""
    val jwtAudience = config.propertyOrNull("jwt.audience")?.getString() ?: ""
    val jwtRealm = config.propertyOrNull("jwt.realm")?.getString() ?: ""
    val jwtSecret = config.propertyOrNull("jwt.secret")?.getString() ?: ""
    val accessExpiration = config.propertyOrNull("jwt.accessExpiration")?.getString()?.toLongOrNull() ?: 3600000
    val refreshExpiration = config.propertyOrNull("jwt.refreshExpiration")?.getString()?.toLongOrNull() ?: 86400000

    // 初始化 Token 生成器
    JwtTokenGenerator.init(
        domain = jwtDomain,
        audience = jwtAudience,
        secret = jwtSecret,
        accessExpiration = accessExpiration,
        refreshExpiration = refreshExpiration
    )

    authentication {
        // Access Token 认证配置（必需）
        jwt("jwt-access") {
            realm = jwtRealm
            verifier(JWT.require(Algorithm.HMAC256(jwtSecret))
                .withAudience(jwtAudience)
                .withIssuer(jwtDomain)
                .build()
            )
            validate { credential ->
                // Access Token 不应该有 type claim，或者 type 不是 "refresh"
                val tokenType = credential.payload.getClaim("type")?.asString()
                if (credential.payload.audience.contains(jwtAudience) && tokenType != "refresh") {
                    JWTPrincipal(credential.payload)
                } else null
            }
            challenge { _, _ ->
                call.respond(HttpStatusCode.Unauthorized, "Access Token is not valid or expired")
            }
        }

        // Refresh Token 认证配置（必需）
        jwt("jwt-refresh") {
            realm = jwtRealm
            verifier(JWT.require(Algorithm.HMAC256(jwtSecret))
                .withAudience(jwtAudience)
                .withIssuer(jwtDomain)
                .build()
            )
            validate { credential ->
                // Refresh Token 必须有 type claim 且值为 "refresh"
                val tokenType = credential.payload.getClaim("type")?.asString()
                if (credential.payload.audience.contains(jwtAudience) && tokenType == "refresh") {
                    JWTPrincipal(credential.payload)
                } else null
            }
            challenge { _, _ ->
                call.respond(HttpStatusCode.Unauthorized, "Refresh Token is not valid or expired")
            }
        }

        // 可选认证配置（用于未登录也能访问的接口）
        jwt("jwt-optional") {
            realm = jwtRealm
            verifier(JWT.require(Algorithm.HMAC256(jwtSecret))
                .withAudience(jwtAudience)
                .withIssuer(jwtDomain)
                .build()
            )
            validate { credential ->
                // 与 jwt-access 相同的验证逻辑
                val tokenType = credential.payload.getClaim("type")?.asString()
                if (credential.payload.audience.contains(jwtAudience) && tokenType != "refresh") {
                    JWTPrincipal(credential.payload)
                } else null
            }
            // 关键：不设置 challenge，即使验证失败也不会返回 401
        }
    }
}
