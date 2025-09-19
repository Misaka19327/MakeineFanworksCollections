package com.misaka.schema

import org.jetbrains.exposed.dao.ImmutableCachedEntityClass
import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.date
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import java.util.UUID

object SubjectPostTable: UUIDTable(
    columnName = "uuid"
) {
    val subjectPostId = integer("subject_post_id")
    val createTimeInTieba = datetime("create_time_in_tieba")
    val favoriteCount = integer("favorite_count")
    val viewCount = integer("view_count")

    val article = reference("article_uuid", ArticleTable).nullable()

    val createTime = datetime("create_time")
    val updateTime = datetime("update_time")
    val deleteTime = datetime("delete_time").nullable()
}

class SubjectPostEntity(uuid: EntityID<UUID>): UUIDEntity(uuid) {
    companion object: ImmutableCachedEntityClass<UUID, SubjectPostEntity>(SubjectPostTable)

    val subjectPostId by SubjectPostTable.subjectPostId
    val createTimeInTieba by SubjectPostTable.createTimeInTieba
    val favoriteCount by SubjectPostTable.favoriteCount
    val viewCount by SubjectPostTable.viewCount
    
    val article by ArticleEntity.optionalReferrersOn(SubjectPostTable.article)

    val createTime by SubjectPostTable.createTime
    val updateTime by SubjectPostTable.updateTime
    val deleteTime by SubjectPostTable.deleteTime
}