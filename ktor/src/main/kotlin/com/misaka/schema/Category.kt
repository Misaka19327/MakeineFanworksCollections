package com.misaka.schema

import org.jetbrains.exposed.dao.ImmutableEntityClass
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IdTable
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.kotlin.datetime.datetime

object CategoryTable: IntIdTable(
    columnName = "id"
) {
    val name = varchar("name", 50)
    val comment = varchar("comment", 200).nullable()

    val createTime = datetime("create_time")
    val updateTime = datetime("update_time")
    val deleteTime = datetime("delete_time").nullable()
}

class CategoryEntity(id: EntityID<Int>): IntEntity(id) {
    companion object: ImmutableEntityClass<Int, CategoryEntity>(CategoryTable)

    val name by CategoryTable.name
    val comment by CategoryTable.comment

    val articles by ArticleEntity.optionalReferrersOn(ArticleTable.category)
        .orderBy(ArticleTable.createTime)

    val createTime by CategoryTable.createTime
    val updateTime by CategoryTable.updateTime
    val deleteTime by CategoryTable.deleteTime
}