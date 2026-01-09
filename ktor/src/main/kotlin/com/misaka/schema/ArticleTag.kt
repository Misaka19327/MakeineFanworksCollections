package com.misaka.schema

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.datetime

/**
 * 文章-标签关联表
 * 用于实现文章和标签之间的多对多关系
 * 保留时间戳字段用于追踪关联关系的创建和更新时间
 */
object ArticleTagTable : Table() {
    val article = reference("article_uuid", ArticleTable)
    val tag = reference("tag_id", TagTable)

    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")
    val deletedAt = datetime("deleted_at").nullable()

    override val primaryKey = PrimaryKey(article, tag)
}

