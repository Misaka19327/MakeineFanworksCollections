package com.misaka

import kotlinx.coroutines.Dispatchers
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import org.jetbrains.exposed.sql.transactions.transaction

/**
 * 用户数据模型
 * 使用Kotlinx序列化注解，用于JSON序列化
 */
@Serializable
data class ExposedUser(val name: String, val age: Int)

/**
 * 用户服务类
 * 处理用户相关的数据库操作
 */
class UserService(database: Database) {
    /**
     * 用户表定义
     * 使用Exposed ORM框架定义表结构
     */
    object Users : Table() {
        val id = integer("id").autoIncrement()  // 自增主键
        val name = varchar("name", length = 50)  // 用户名字段，最大长度50
        val age = integer("age")                 // 年龄字段

        override val primaryKey = PrimaryKey(id)  // 设置主键
    }

    /**
     * 初始化数据库表
     */
    init {
        transaction(database) {
            SchemaUtils.create(Users)  // 创建用户表
        }
    }

    /**
     * 创建新用户
     * @param user 用户数据
     * @return 新创建用户的ID
     */
    suspend fun create(user: ExposedUser): Int = dbQuery {
        Users.insert {
            it[name] = user.name  // 设置用户名
            it[age] = user.age    // 设置年龄
        }[Users.id]  // 返回新创建用户的ID
    }

    /**
     * 读取用户信息
     * @param id 用户ID
     * @return 用户信息，如果不存在返回null
     */
    suspend fun read(id: Int): ExposedUser? {
        return dbQuery {
            Users.selectAll()
                .where { Users.id eq id }  // 根据ID查询
                .map { ExposedUser(it[Users.name], it[Users.age]) }  // 转换为ExposedUser对象
                .singleOrNull()  // 返回单个结果或null
        }
    }

    /**
     * 更新用户信息
     * @param id 用户ID
     * @param user 新的用户数据
     */
    suspend fun update(id: Int, user: ExposedUser) {
        dbQuery {
            Users.update({ Users.id eq id }) {  // 根据ID更新
                it[name] = user.name  // 更新用户名
                it[age] = user.age    // 更新年龄
            }
        }
    }

    /**
     * 删除用户
     * @param id 用户ID
     */
    suspend fun delete(id: Int) {
        dbQuery {
            Users.deleteWhere { Users.id.eq(id) }  // 根据ID删除
        }
    }

    /**
     * 数据库查询辅助函数
     * 在IO调度器上执行数据库操作
     */
    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}

