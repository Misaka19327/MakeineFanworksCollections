package com.misaka.schema

import org.jetbrains.exposed.dao.EntityClass
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.kotlin.datetime.datetime
import javax.swing.text.html.parser.Entity

abstract class BaseTable(name: String = ""): Table() {
    val createdAt = datetime("created_at")
    val updatedAt = datetime("updated_at")
    val deletedAt = datetime("deleted_at").nullable()
}

abstract class BaseIntEntity(id: EntityID<Int>, table: BaseTable): IntEntity(id) {
    val createdAt by table.createdAt
    val updatedAt by table.updatedAt
    val deletedAt by table.deletedAt
}

abstract class BaseEntityClass<out E: BaseIntEntity>(table: BaseTable): IntEntityClass<E>(table) {

}