package com.misaka.schema

import org.jetbrains.exposed.sql.Table

object InterfaceEndPointTable : Table() {
    val uuid = uuid("uuid")
    val name = varchar("name", 100)
    val path = array<String>("path")
    val

    override val primaryKey: PrimaryKey get() = PrimaryKey(uuid)
}

class InterfaceEndpoint {
}