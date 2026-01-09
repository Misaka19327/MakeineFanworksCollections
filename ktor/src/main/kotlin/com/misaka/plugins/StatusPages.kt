package com.misaka.plugins

import com.misaka.common.ErrorResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.response.respond
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("StatusPages")

/**
 * 配置全局异常处理
 * 捕获所有未处理的异常并返回标准错误格式
 */
fun Application.configureStatusPages() {
    install(StatusPages) {
        // 处理非法参数异常
        exception<IllegalArgumentException> { call, cause ->
            logger.warn("IllegalArgumentException: ${cause.message}", cause)
            call.respond(
                HttpStatusCode.BadRequest,
                ErrorResponse(
                    code = "VALIDATION_ERROR",
                    message = cause.message ?: "Invalid argument"
                )
            )
        }

        // 处理非法状态异常
        exception<IllegalStateException> { call, cause ->
            logger.warn("IllegalStateException: ${cause.message}", cause)
            call.respond(
                HttpStatusCode.Conflict,
                ErrorResponse(
                    code = "CONFLICT",
                    message = cause.message ?: "Operation conflict"
                )
            )
        }

        // 处理未授权异常
        exception<SecurityException> { call, cause ->
            logger.warn("SecurityException: ${cause.message}", cause)
            call.respond(
                HttpStatusCode.Unauthorized,
                ErrorResponse(
                    code = "UNAUTHORIZED",
                    message = cause.message ?: "Unauthorized access"
                )
            )
        }

        // 处理其他所有异常
        exception<Throwable> { call, cause ->
            logger.error("Unhandled exception: ${cause.message}", cause)
            call.respond(
                HttpStatusCode.InternalServerError,
                ErrorResponse(
                    code = "INTERNAL_ERROR",
                    message = "An internal error occurred"
                )
            )
        }
    }
}
