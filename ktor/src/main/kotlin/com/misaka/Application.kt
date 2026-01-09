package com.misaka

import com.misaka.plugins.configureAsyncApiDocument
import com.misaka.plugins.configureAuthenticationJwt
import com.misaka.plugins.configureCallLogging
import com.misaka.plugins.configureCors
import com.misaka.plugins.configureKoin
import com.misaka.plugins.configureSSE
import com.misaka.plugins.configureSimpleCache
import com.misaka.plugins.configureStatusPages
import com.misaka.plugins.configureTask
import com.misaka.events.EventBus
import io.ktor.server.application.Application

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    // 配置依赖注入（必须首先调用）
    configureKoin()

    // 配置全局异常处理（应该在路由之前配置）
    configureStatusPages()

    // 配置其他插件
    configureAsyncApiDocument()
    configureAuthenticationJwt()
    configureCallLogging()
    configureCors()
    configureSimpleCache()
    configureSSE()
    configureTask()

    // 初始化事件总线
    EventBus.init(workerCount = 4)
}

