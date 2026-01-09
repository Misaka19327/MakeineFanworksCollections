package com.misaka.common

import kotlinx.serialization.Serializable

/**
 * 统一的错误响应格式
 * 用于返回给客户端的标准错误信息
 *
 * @param code 错误代码，用于前端识别错误类型
 * @param message 错误消息，人类可读的错误描述
 * @param timestamp 错误发生时间戳（毫秒）
 */
@Serializable
data class ErrorResponse(
    val code: String,
    val message: String,
    val timestamp: Long = System.currentTimeMillis()
)
