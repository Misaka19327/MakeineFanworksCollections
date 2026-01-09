package com.misaka.common

import io.ktor.http.HttpStatusCode

/**
 * 统一的 Service 层返回类型
 * 用于封装操作结果，便于统一处理成功和失败情况
 */
sealed class ServiceResult<out T> {
    /**
     * 操作成功
     * @param data 返回的数据
     */
    data class Success<T>(val data: T) : ServiceResult<T>()

    /**
     * 操作失败
     * @param code 错误代码
     * @param message 错误消息
     * @param statusCode HTTP 状态码，默认为 400 Bad Request
     */
    data class Error(
        val code: String,
        val message: String,
        val statusCode: HttpStatusCode = HttpStatusCode.BadRequest
    ) : ServiceResult<Nothing>()
}
