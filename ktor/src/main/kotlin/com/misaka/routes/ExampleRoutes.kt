package com.misaka.routes

import com.misaka.common.getOptionalUserIdFromJWT
import io.ktor.http.HttpStatusCode
import io.ktor.server.auth.authenticate
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import kotlinx.serialization.Serializable

/**
 * 示例：可选认证路由
 * 这些接口展示了如何使用可选认证来支持未登录也能访问的功能
 */

@Serializable
data class ArticleResponse(
    val id: String,
    val title: String,
    val content: String,
    val isPublic: Boolean,
    val authorId: String,
    val isOwned: Boolean = false  // 是否是当前登录用户的文章
)

fun Route.exampleRoutes() {
    route("/examples") {
        
        /**
         * 示例 1：文章列表（支持可选认证）
         * - 未登录：只能看到公开文章
         * - 已登录：可以看到公开文章 + 自己的私有文章，并标记自己的文章
         */
        authenticate("jwt-optional", optional = true) {
            get("/articles") {
                val currentUserId = call.getOptionalUserIdFromJWT()
                
                // 模拟数据（实际应该从数据库获取）
                val allArticles = listOf(
                    ArticleResponse("1", "公开文章1", "内容1", isPublic = true, authorId = "user1"),
                    ArticleResponse("2", "公开文章2", "内容2", isPublic = true, authorId = "user2"),
                    ArticleResponse("3", "私有文章3", "内容3", isPublic = false, authorId = "user1"),
                    ArticleResponse("4", "私有文章4", "内容4", isPublic = false, authorId = "user2")
                )
                
                val result = if (currentUserId == null) {
                    // 未登录：只返回公开文章
                    allArticles.filter { it.isPublic }
                } else {
                    // 已登录：返回公开文章 + 自己的私有文章，并标记自己的文章
                    allArticles
                        .filter { it.isPublic || it.authorId == currentUserId.toString() }
                        .map { article ->
                            article.copy(isOwned = article.authorId == currentUserId.toString())
                        }
                }
                
                call.respond(HttpStatusCode.OK, result)
            }
        }
        
        /**
         * 示例 2：点赞统计（支持可选认证）
         * - 未登录：只能看到点赞数
         * - 已登录：可以看到点赞数 + 自己是否点赞过
         */
        authenticate("jwt-optional", optional = true) {
            get("/articles/{id}/likes") {
                val currentUserId = call.getOptionalUserIdFromJWT()
                val articleId = call.parameters["id"] ?: return@get call.respond(
                    HttpStatusCode.BadRequest,
                    "Missing article ID"
                )
                
                // 模拟数据
                val likesCount = 42
                val hasLiked = currentUserId != null && (currentUserId.toString().hashCode() % 2 == 0)
                
                val response = if (currentUserId == null) {
                    mapOf(
                        "articleId" to articleId,
                        "likesCount" to likesCount
                    )
                } else {
                    mapOf(
                        "articleId" to articleId,
                        "likesCount" to likesCount,
                        "hasLiked" to hasLiked,
                        "currentUserId" to currentUserId.toString()
                    )
                }
                
                call.respond(HttpStatusCode.OK, response)
            }
        }
        
        /**
         * 示例 3：用户资料（支持可选认证）
         * - 未登录：只能看到公开信息
         * - 已登录：可以看到更多信息
         * - 查看自己：可以看到所有私密信息
         */
        authenticate("jwt-optional", optional = true) {
            get("/users/{userId}") {
                val currentUserId = call.getOptionalUserIdFromJWT()
                val targetUserId = call.parameters["userId"] ?: return@get call.respond(
                    HttpStatusCode.BadRequest,
                    "Missing user ID"
                )
                
                val isOwner = currentUserId?.toString() == targetUserId
                val isLoggedIn = currentUserId != null
                
                val response = buildMap {
                    put("userId", targetUserId)
                    put("nickname", "示例用户")
                    put("avatar", "https://example.com/avatar.jpg")
                    
                    // 已登录用户可以看到更多信息
                    if (isLoggedIn) {
                        put("email", "user@example.com")
                        put("joinDate", "2024-01-01")
                    }
                    
                    // 查看自己的资料时显示私密信息
                    if (isOwner) {
                        put("phone", "+86 138****1234")
                        put("address", "北京市")
                        put("isEmailVerified", true)
                    }
                }
                
                call.respond(HttpStatusCode.OK, response)
            }
        }
    }
}
