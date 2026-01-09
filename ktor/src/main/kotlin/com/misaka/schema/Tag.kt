package com.misaka.schema

import org.jetbrains.exposed.dao.ImmutableEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SortOrder

object TagTable : BaseIntTable(name = "tag", columnName = "id") {
    val tagName = varchar("tag_name", 200)
}

class TagEntity(id: EntityID<Int>) : BaseIntEntity(id, TagTable) {
    companion object : ImmutableEntityClass<Int, TagEntity>(TagTable)

    val tagName by TagTable.tagName

    val articles by ArticleEntity via ArticleTagTable orderBy listOf(
        ArticleTable.createdAt to SortOrder.DESC_NULLS_LAST
    )
}
