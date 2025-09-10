package com.misaka.plugins

import com.misaka.enums.LoggerType
import com.mongodb.kotlin.client.coroutine.MongoClient
import io.github.flaxoos.ktor.server.plugins.taskscheduling.TaskScheduling
import io.github.flaxoos.ktor.server.plugins.taskscheduling.managers.lock.database.DefaultTaskLockTable
import io.github.flaxoos.ktor.server.plugins.taskscheduling.managers.lock.database.jdbc
import io.github.flaxoos.ktor.server.plugins.taskscheduling.managers.lock.database.mongoDb
import io.github.flaxoos.ktor.server.plugins.taskscheduling.managers.lock.redis.redis
import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.koin.core.qualifier.named
import org.koin.ktor.ext.get
import org.koin.ktor.ext.inject
import org.slf4j.Logger

fun Application.configureTask() {
    install(TaskScheduling) {
        val config = environment.config
        val configHost = config.propertyOrNull("redis.task.host")?.getString() ?: "localhost"
        val configPort = config.propertyOrNull("redis.task.port")?.getString() ?: "6379"
        val configPassword = config.propertyOrNull("redis.task.password")?.getString()

        // warning 注意 taskManager 必须都有任务 否则抛出异常

//        redis(name = "redisManager") { // 任务调度所需redis
//            connectionPoolInitialSize = 2
//            host = configHost
//            port = configPort.toInt()
//            username = ""
//            password = configPassword
//            connectionAcquisitionTimeoutMs = 1_000
//            lockExpirationMs = 60_000
//        }

        val globalDatabase: Database = get()
        jdbc(name = "sqlManager") { // 任务调度所需数据库
            database = globalDatabase.also {
                transaction { SchemaUtils.create(DefaultTaskLockTable) }
            }
        }

        task(taskManagerName = "sqlManager") { // 自动任务示例
            name = "My task"
            task = { taskExecutionTime ->
                val logger: Logger by inject(named(LoggerType.TaskLogger))
                logger.info("My task is running: $taskExecutionTime")
            }
            kronSchedule = {
                seconds {
                    from(0).every(5)
                }
            }
            concurrency = 2
        }
    }
}