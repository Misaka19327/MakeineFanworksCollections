package com.misaka.schema

import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import java.util.UUID

object UserTable: UUIDTable(
    columnName = "uuid"
) {
    val userName = varchar(name = "user_name", length = 50)
    val tiebaId = varchar(name = "tieba_id", length = 50)

    val createTime = datetime("create_time")
    val updateTime = datetime("update_time")
    val deleteTime = datetime("delete_time").nullable()
}

class UserEntity(uuid: EntityID<UUID>): UUIDEntity(uuid) {
    companion object: UUIDEntityClass<UserEntity>(UserTable)

    val userName by UserTable.userName
    val tiebaId by UserTable.tiebaId

    val articles by ArticleEntity referrersOn ArticleTable.user orderBy ArticleTable.createTime

    val createTime by UserTable.createTime
    val updateTime by UserTable.updateTime
    val deleteTime by UserTable.deleteTime
}