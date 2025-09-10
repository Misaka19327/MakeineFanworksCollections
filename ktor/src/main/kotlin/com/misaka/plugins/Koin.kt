package com.misaka.plugins

import com.misaka.di.BaseModule
import com.misaka.di.HelloModule
import io.ktor.server.application.Application
import io.ktor.server.application.install
import org.koin.core.context.startKoin
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

fun Application.configureKoin() {
    val config = environment.config

    startKoin {
        modules(
            module {
                single {
                    config // 解决本地运行时 koin 找不到 Application 实例的问题
                }
            },
            HelloModule,
            BaseModule
        )
    }
}