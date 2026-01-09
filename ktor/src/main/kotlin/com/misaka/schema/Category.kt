package com.misaka.schema

import org.jetbrains.exposed.dao.ImmutableEntityClass
import org.jetbrains.exposed.dao.id.EntityID

object CategoryTable : BaseIntTable(name = "category", columnName = "id") {
    val name = varchar("name", 50)
    val comment = varchar("comment", 200).nullable()
}

class CategoryEntity(id: EntityID<Int>) : BaseIntEntity(id, CategoryTable) {
    companion object : ImmutableEntityClass<Int, CategoryEntity>(CategoryTable)

    val name by CategoryTable.name
    val comment by CategoryTable.comment

    val articles by ArticleEntity.optionalReferrersOn(ArticleTable.category)
        .orderBy(ArticleTable.createdAt)
}
