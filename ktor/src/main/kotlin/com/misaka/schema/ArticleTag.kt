package com.misaka.schema

import org.jetbrains.exposed.dao.CompositeEntity
import org.jetbrains.exposed.dao.Entity
import org.jetbrains.exposed.dao.EntityClass
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.id.CompositeIdTable
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IdTable
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.datetime

object ArticleTagTable: Table() {
    val article = reference("article_uuid", ArticleTable)
    val tag = reference("tag_id", TagTable)

    val createTime = datetime("create_time")
    val updateTime = datetime("update_time")
    val deleteTime = datetime("delete_time").nullable()

    override val primaryKey = PrimaryKey(article, tag)
}
