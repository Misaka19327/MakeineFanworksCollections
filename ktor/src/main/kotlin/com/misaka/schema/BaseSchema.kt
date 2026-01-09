package com.misaka.schema

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import java.util.UUID

/**
 * 基于 UUID 的表基类
 * 自动添加 createdAt、updatedAt、deletedAt 时间字段
 */
abstract class BaseUUIDTable(name: String = "", columnName: String = "uuid") : UUIDTable(name, columnName) {
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")
    val deletedAt = datetime("deleted_at").nullable()
}

/**
 * 基于 Int 的表基类
 * 自动添加 createdAt、updatedAt、deletedAt 时间字段
 */
abstract class BaseIntTable(name: String = "", columnName: String = "id") : IntIdTable(name, columnName) {
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")
    val deletedAt = datetime("deleted_at").nullable()
}

/**
 * 基于 UUID 的实体基类
 * 提供对基础时间字段的访问
 */
abstract class BaseUUIDEntity(id: EntityID<UUID>, table: BaseUUIDTable) : UUIDEntity(id) {
    val createdAt by table.createdAt
    val updatedAt by table.updatedAt
    val deletedAt by table.deletedAt
}

/**
 * 基于 Int 的实体基类
 * 提供对基础时间字段的访问
 */
abstract class BaseIntEntity(id: EntityID<Int>, table: BaseIntTable) : IntEntity(id) {
    val createdAt by table.createdAt
    val updatedAt by table.updatedAt
    val deletedAt by table.deletedAt
}
