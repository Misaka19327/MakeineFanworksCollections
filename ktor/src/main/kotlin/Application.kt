package com.misaka

import io.ktor.server.application.*

/**
 * 应用程序入口点
 * 使用Ktor的Netty引擎启动服务器
 * @param args 命令行参数
 */
fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

/**
 * 应用程序模块配置
 * 这是Ktor应用程序的主要配置点，按顺序配置各个功能模块
 * 配置顺序很重要，因为某些模块可能依赖于其他模块
 */
fun Application.module() {
    // 配置HTTP服务器设置，如端口、SSL等
    configureHTTP()
    
    // 配置安全相关功能，如认证、授权等
    configureSecurity()
    
    // 配置序列化功能，用于JSON处理
    configureSerialization()
    
    // 配置数据库连接和ORM设置
    configureDatabases()
    
    // 配置Web框架相关功能
    configureFrameworks()
    
    // 配置管理功能，如监控、日志等
    configureAdministration()
    
    // 配置路由规则，定义API端点
    configureRouting()
}
