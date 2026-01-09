package com.misaka.repository

import com.misaka.schema.UserEntity
import com.misaka.schema.UserTable
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import java.util.UUID

class UserRepository {

    suspend fun findByEmail(email: String): UserEntity? = dbQuery {
        UserEntity.find { UserTable.email eq email }.singleOrNull()
    }

    suspend fun findById(uuid: UUID): UserEntity? = dbQuery {
        UserEntity.findById(uuid)
    }
    
    suspend fun findByNickname(nickname: String): UserEntity? = dbQuery {
        UserEntity.find { UserTable.nickname eq nickname }.singleOrNull()
    }

    suspend fun create(
        nickname: String,
        email: String,
        passwordHash: String,
        salt: String,
        longId: String?
    ): UserEntity = dbQuery {
        UserEntity.new {
            this.nickname = nickname
            this.email = email
            this.passwordHash = passwordHash
            this.salt = salt
            this.longId = longId
            // Initialize legacy fields to null or safe defaults if required by constraints (they are nullable in our schema update)
        }
    }

    private suspend fun <T> dbQuery(block: suspend () -> T): T =
        newSuspendedTransaction(Dispatchers.IO) { block() }
}
