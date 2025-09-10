package com.misaka.plugins

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.authentication
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.config.tryGetString
import io.ktor.server.response.respond

fun Application.configureAuthenticationJwt() {
    install(Authentication)

    val config = environment.config

    val jwtDomain = config.propertyOrNull("jwt.domain")?.getString() ?: ""
    val jwtAudience = config.propertyOrNull("jwt.audience")?.getString() ?: ""
    val jwtRealm = config.propertyOrNull("jwt.realm")?.getString() ?: ""
    val jwtSecret = config.propertyOrNull("jwt.secret")?.getString() ?: ""
    authentication {
        jwt {
            realm = jwtRealm
            verifier(JWT.require(Algorithm.HMAC256(jwtSecret))
                .withAudience(jwtAudience)
                .withIssuer(jwtDomain)
                .build()
            )
            validate { credential ->
                if (credential.payload.audience.contains(jwtAudience)) JWTPrincipal(credential.payload) else null
            }
            challenge { _, _ ->
                call.respond(HttpStatusCode.Unauthorized, "Token is not valid or expired")
            }
        }
    }
}