package com.misaka.schema

import org.jetbrains.exposed.dao.ImmutableCachedEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import java.util.UUID

object SubjectPostTable : BaseUUIDTable(name = "subject_post", columnName = "uuid") {
    val subjectPostId = integer("subject_post_id")
    val createTimeInTieba = datetime("create_time_in_tieba")
    val favoriteCount = integer("favorite_count")
    val viewCount = integer("view_count")

    val article = reference("article_uuid", ArticleTable).nullable()
}

class SubjectPostEntity(uuid: EntityID<UUID>) : BaseUUIDEntity(uuid, SubjectPostTable) {
    companion object : ImmutableCachedEntityClass<UUID, SubjectPostEntity>(SubjectPostTable)

    val subjectPostId by SubjectPostTable.subjectPostId
    val createTimeInTieba by SubjectPostTable.createTimeInTieba
    val favoriteCount by SubjectPostTable.favoriteCount
    val viewCount by SubjectPostTable.viewCount

    val article by ArticleEntity.optionalReferrersOn(SubjectPostTable.article)
}
