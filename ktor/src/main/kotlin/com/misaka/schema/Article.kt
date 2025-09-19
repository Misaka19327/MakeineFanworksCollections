package com.misaka.schema

import org.jetbrains.exposed.dao.ImmutableCachedEntityClass
import org.jetbrains.exposed.dao.ImmutableEntityClass
import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import java.util.UUID

object ArticleTable: UUIDTable(
    columnName = "uuid"
) {
    val title = varchar("title", 200)
    val authorUUID = uuid("author_uuid")

    val user = reference("user_uuid", UserTable)
    val subjectPost = reference("subject_post_uuid", SubjectPostTable).nullable()
    val category = reference("category_id", CategoryTable).nullable()

    val createTime = datetime("create_time")
    val updateTime = datetime("update_time")
    val deleteTime = datetime("delete_time").nullable()
}

class ArticleEntity(uuid: EntityID<UUID>): UUIDEntity(uuid) {
    companion object: ImmutableCachedEntityClass<UUID, ArticleEntity>(ArticleTable)

    val title by ArticleTable.title
    val authorUUID by ArticleTable.authorUUID

    val user by UserEntity referrersOn ArticleTable.user
    val subjectPost by SubjectPostEntity.optionalReferrersOn(ArticleTable.subjectPost)
    val category by CategoryEntity.optionalReferrersOn(ArticleTable.category)

    val tags by TagEntity.via(ArticleTagTable).orderBy(
        listOf(
            ArticleTagTable.createTime to SortOrder.DESC_NULLS_LAST
        )
    )

    val createTime by ArticleTable.createTime
    val updateTime by ArticleTable.updateTime
    val deleteTime by ArticleTable.deleteTime
}