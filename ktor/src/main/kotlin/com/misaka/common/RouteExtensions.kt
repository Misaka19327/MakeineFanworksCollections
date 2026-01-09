package com.misaka.common

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.auth.jwt.JWTPrincipal
import io.ktor.server.auth.principal
import io.ktor.server.response.respond
import kotlinx.serialization.Serializable
import java.util.UUID

/**
 * 从 JWT 中提取用户 ID
 * @return 用户 UUID，如果提取失败返回 null
 */
fun ApplicationCall.getUserIdFromJWT(): UUID? {
    return principal<JWTPrincipal>()
        ?.payload
        ?.getClaim("uuid")
        ?.asString()
        ?.let { runCatching { UUID.fromString(it) }.getOrNull() }
}

/**
 * 从 JWT 中提取用户 ID（可选认证）
 * 用于需要支持未登录访问的接口
 * @return 用户 UUID（如果已登录），未登录返回 null
 */
fun ApplicationCall.getOptionalUserIdFromJWT(): UUID? {
    return getUserIdFromJWT()
}

/**
 * 从 JWT 中提取 Token 类型
 * @return Token 类型（access 或 refresh），如果提取失败返回 null
 */
fun ApplicationCall.getTokenType(): String? {
    return principal<JWTPrincipal>()
        ?.payload
        ?.getClaim("type")
        ?.asString()
}

/**
 * 统一处理 ServiceResult 并返回响应
 * 根据 ServiceResult 的类型自动选择合适的 HTTP 状态码和响应格式
 */
suspend inline fun <reified T : Any> ApplicationCall.respondResult(result: ServiceResult<T>) {
    when (result) {
        is ServiceResult.Success -> {
            respond(HttpStatusCode.OK, result.data)
        }
        is ServiceResult.Error -> {
            respond(
                result.statusCode,
                ErrorResponse(
                    code = result.code,
                    message = result.message
                )
            )
        }
    }
}

/**
 * 统一处理 ServiceResult 并返回响应（带自定义成功状态码）
 * @param successStatusCode 成功时返回的 HTTP 状态码
 */
suspend inline fun <reified T : Any> ApplicationCall.respondResult(
    result: ServiceResult<T>,
    successStatusCode: HttpStatusCode
) {
    when (result) {
        is ServiceResult.Success -> {
            respond(successStatusCode, result.data)
        }
        is ServiceResult.Error -> {
            respond(
                result.statusCode,
                ErrorResponse(
                    code = result.code,
                    message = result.message
                )
            )
        }
    }
}
