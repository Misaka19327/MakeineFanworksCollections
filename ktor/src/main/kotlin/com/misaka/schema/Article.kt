package com.misaka.schema

import org.jetbrains.exposed.dao.ImmutableCachedEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SortOrder
import java.util.UUID

object ArticleTable : BaseUUIDTable(name = "article", columnName = "uuid") {
    val title = varchar("title", 200)
    val authorUUID = uuid("author_uuid")

    val user = reference("user_uuid", UserTable)
    val subjectPost = reference("subject_post_uuid", SubjectPostTable).nullable()
    val category = reference("category_id", CategoryTable).nullable()
}

class ArticleEntity(uuid: EntityID<UUID>) : BaseUUIDEntity(uuid, ArticleTable) {
    companion object : ImmutableCachedEntityClass<UUID, ArticleEntity>(ArticleTable)

    val title by ArticleTable.title
    val authorUUID by ArticleTable.authorUUID

    val user by UserEntity referrersOn ArticleTable.user
    val subjectPost by SubjectPostEntity.optionalReferrersOn(ArticleTable.subjectPost)
    val category by CategoryEntity.optionalReferrersOn(ArticleTable.category)

    val tags by TagEntity.via(ArticleTagTable).orderBy(
        listOf(
            ArticleTagTable.createdAt to SortOrder.DESC_NULLS_LAST
        )
    )
}
