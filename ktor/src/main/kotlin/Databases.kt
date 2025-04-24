package com.misaka

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.mongodb.kotlin.client.coroutine.MongoClient
import com.ucasoft.ktor.simpleCache.SimpleCache
import com.ucasoft.ktor.simpleCache.cacheOutput
import com.ucasoft.ktor.simpleMemoryCache.*
import com.ucasoft.ktor.simpleRedisCache.*
import dev.inmo.krontab.builder.*
import io.github.flaxoos.ktor.server.plugins.taskscheduling.*
import io.github.flaxoos.ktor.server.plugins.taskscheduling.managers.lock.database.*
import io.github.flaxoos.ktor.server.plugins.taskscheduling.managers.lock.redis.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.engine.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlin.random.Random
import kotlin.time.Duration.Companion.seconds
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin
import org.koin.logger.slf4jLogger

/**
 * 配置数据库相关的功能
 * 包括数据库连接和用户CRUD操作的API端点
 */
fun Application.configureDatabases() {
    // 配置H2内存数据库连接
    val database = Database.connect(
        url = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1", // 使用H2内存数据库
        user = "root",                              // 数据库用户名
        driver = "org.h2.Driver",                   // H2数据库驱动
        password = "",                              // 数据库密码
    )

    // 创建用户服务实例
    val userService = UserService(database)

    // 配置用户相关的路由
    routing {
        // 创建用户
        post("/users") {
            val user = call.receive<ExposedUser>()  // 接收用户数据
            val id = userService.create(user)       // 创建用户并获取ID
            call.respond(HttpStatusCode.Created, id) // 返回创建状态和ID
        }

        // 读取用户信息
        get("/users/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val user = userService.read(id)         // 读取用户信息
            if (user != null) {
                call.respond(HttpStatusCode.OK, user)  // 返回用户信息
            } else {
                call.respond(HttpStatusCode.NotFound) // 用户不存在
            }
        }

        // 更新用户信息
        put("/users/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            val user = call.receive<ExposedUser>()  // 接收更新的用户数据
            userService.update(id, user)            // 更新用户信息
            call.respond(HttpStatusCode.OK)         // 返回更新成功状态
        }

        // 删除用户
        delete("/users/{id}") {
            val id = call.parameters["id"]?.toInt() ?: throw IllegalArgumentException("Invalid ID")
            userService.delete(id)                  // 删除用户
            call.respond(HttpStatusCode.OK)         // 返回删除成功状态
        }
    }
}
