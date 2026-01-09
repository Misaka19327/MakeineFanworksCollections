package com.misaka.schema

import org.jetbrains.exposed.dao.id.EntityID
import java.util.UUID

object UserTable : BaseUUIDTable(name = "user", columnName = "uuid") {
    val nickname = varchar("nickname", 100)
    val avatar = varchar("avatar", 255).nullable()
    val email = varchar("email", 255).uniqueIndex()
    val passwordHash = varchar("password_hash", 255)
    val salt = varchar("salt", 255)
    val longId = text("long_id").nullable()

    // 遗留字段 - 保留以保持向后兼容
    val userName = varchar(name = "user_name", length = 50).nullable()
    val tiebaId = varchar(name = "tieba_id", length = 50).nullable()
}

class UserEntity(uuid: EntityID<UUID>) : BaseUUIDEntity(uuid, UserTable) {
    companion object : org.jetbrains.exposed.dao.UUIDEntityClass<UserEntity>(UserTable)

    var nickname by UserTable.nickname
    var avatar by UserTable.avatar
    var email by UserTable.email
    var passwordHash by UserTable.passwordHash
    var salt by UserTable.salt
    var longId by UserTable.longId

    // 遗留字段
    var userName by UserTable.userName
    var tiebaId by UserTable.tiebaId

    val articles by ArticleEntity referrersOn ArticleTable.user orderBy ArticleTable.createdAt
}
