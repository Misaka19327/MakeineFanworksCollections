package com.misaka.schema

import nonapi.io.github.classgraph.json.Id
import org.jetbrains.exposed.dao.ImmutableCachedEntityClass
import org.jetbrains.exposed.dao.ImmutableEntityClass
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import java.util.UUID

object TagTable: IntIdTable(
    columnName = "id"
) {
    val tagName = varchar("tag_name", 200)

    val createTime = datetime("create_time")
    val updateTime = datetime("update_time")
    val deleteTime = datetime("delete_time").nullable()
}

class TagEntity(id: EntityID<Int>): IntEntity(id) {
    companion object: ImmutableEntityClass<Int, TagEntity>(TagTable)

    val tagName by TagTable.tagName

    val articles by ArticleEntity via ArticleTagTable orderBy listOf(
        ArticleTable.createTime to SortOrder.DESC_NULLS_LAST
    )

    val createTime by TagTable.createTime
    val updateTime by TagTable.updateTime
    val deleteTime by TagTable.deleteTime
}