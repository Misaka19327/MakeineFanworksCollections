package com.misaka.routes

import com.misaka.common.ErrorResponse
import com.misaka.common.getUserIdFromJWT
import com.misaka.common.getTokenType
import com.misaka.common.respondResult
import com.misaka.schema.UserEntity
import com.misaka.service.LoginRequest
import com.misaka.service.RegisterRequest
import com.misaka.service.UserService
import io.ktor.http.HttpStatusCode
import io.ktor.server.auth.authenticate
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import kotlinx.serialization.Serializable
import org.koin.ktor.ext.inject

@Serializable
data class UserResponse(
    val uuid: String,
    val nickname: String,
    val email: String,
    val avatar: String?,
    val longId: String?
)

fun UserEntity.toResponse() = UserResponse(
    uuid = this.id.value.toString(),
    nickname = this.nickname,
    email = this.email,
    avatar = this.avatar,
    longId = this.longId
)

fun Route.authRoutes() {
    val userService by inject<UserService>()

    route("/auth") {
        // 用户注册
        post("/register") {
            val request = call.receive<RegisterRequest>()
            call.respondResult(userService.register(request), HttpStatusCode.Created)
        }

        // 用户登录
        post("/login") {
            val request = call.receive<LoginRequest>()
            call.respondResult(userService.login(request))
        }

        // 需要 Access Token 的端点
        authenticate("jwt-access") {
            // 获取当前用户信息
            get("/me") {
                val userId = call.getUserIdFromJWT()
                    ?: return@get call.respond(
                        HttpStatusCode.Unauthorized,
                        ErrorResponse("AUTH_001", "无效的 Token")
                    )

                call.respondResult(userService.getCurrentUser(userId))
            }
        }

        // 需要 Refresh Token 的端点
        authenticate("jwt-refresh") {
            // 刷新 Token
            post("/refresh") {
                val userId = call.getUserIdFromJWT()
                    ?: return@post call.respond(
                        HttpStatusCode.Unauthorized,
                        ErrorResponse("AUTH_001", "无效的 Refresh Token")
                    )

                call.respondResult(userService.refreshToken(userId))
            }
        }
    }
}
