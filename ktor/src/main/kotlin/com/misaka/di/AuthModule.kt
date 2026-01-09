package com.misaka.di

import com.misaka.repository.UserRepository
import com.misaka.service.UserService
import org.koin.dsl.module

val AuthModule = module {
    single { UserRepository() }
    // UserService 只依赖 UserRepository，Token 生成由 JWT 插件提供
    single { UserService(get()) }
}
