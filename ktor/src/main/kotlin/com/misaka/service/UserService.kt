package com.misaka.service

import com.misaka.common.ServiceResult
import com.misaka.events.EventBus
import com.misaka.events.UserLoggedIn
import com.misaka.events.UserRegistered
import com.misaka.plugins.JwtTokenGenerator
import com.misaka.repository.UserRepository
import com.misaka.schema.UserEntity
import io.ktor.http.HttpStatusCode
import kotlinx.serialization.Serializable
import org.mindrot.jbcrypt.BCrypt
import java.util.UUID

@Serializable
data class TokenResponse(
    val accessToken: String,
    val refreshToken: String
)

@Serializable
data class RegisterRequest(
    val nickname: String,
    val email: String,
    val password: String,
    val longId: String? = null
)

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

class UserService(
    private val userRepository: UserRepository
) {

    /**
     * 用户注册
     * 完整的注册流程：验证 -> 创建用户 -> 发布事件
     */
    suspend fun register(request: RegisterRequest): ServiceResult<UserEntity> {
        // 输入验证
        if (request.nickname.isBlank()) {
            return ServiceResult.Error(
                code = "VALIDATION_ERROR",
                message = "昵称不能为空",
                statusCode = HttpStatusCode.BadRequest
            )
        }
        if (request.email.isBlank() || !request.email.contains("@")) {
            return ServiceResult.Error(
                code = "VALIDATION_ERROR",
                message = "邮箱格式不正确",
                statusCode = HttpStatusCode.BadRequest
            )
        }
        if (request.password.length < 6) {
            return ServiceResult.Error(
                code = "VALIDATION_ERROR",
                message = "密码长度至少为 6 位",
                statusCode = HttpStatusCode.BadRequest
            )
        }

        // 检查邮箱是否已注册
        if (userRepository.findByEmail(request.email) != null) {
            return ServiceResult.Error(
                code = "EMAIL_EXISTS",
                message = "该邮箱已被注册",
                statusCode = HttpStatusCode.Conflict
            )
        }

        // 创建用户
        val salt = BCrypt.gensalt()
        val passwordHash = BCrypt.hashpw(request.password, salt)
        val user = userRepository.create(
            request.nickname,
            request.email,
            passwordHash,
            salt,
            request.longId
        )

        // 发布注册事件
        EventBus.publish(UserRegistered(user))

        return ServiceResult.Success(user)
    }

    /**
     * 用户登录
     * 完整的登录流程：验证凭证 -> 生成 Token -> 发布事件
     */
    suspend fun login(request: LoginRequest): ServiceResult<TokenResponse> {
        // 查找用户
        val user = userRepository.findByEmail(request.email)

        // 验证凭证
        if (user == null || !BCrypt.checkpw(request.password, user.passwordHash)) {
            return ServiceResult.Error(
                code = "INVALID_CREDENTIALS",
                message = "邮箱或密码错误",
                statusCode = HttpStatusCode.Unauthorized
            )
        }

        // 生成 Token（使用 JWT 插件提供的生成器）
        val accessToken = JwtTokenGenerator.generateAccessToken(user)
        val refreshToken = JwtTokenGenerator.generateRefreshToken(user)

        // 发布登录事件
        EventBus.publish(UserLoggedIn(user))

        return ServiceResult.Success(
            TokenResponse(accessToken, refreshToken)
        )
    }

    /**
     * 获取当前用户信息
     */
    suspend fun getCurrentUser(userId: UUID): ServiceResult<UserEntity> {
        // TODO: Add Redis caching here as requested
        val user = userRepository.findById(userId)

        return if (user != null) {
            ServiceResult.Success(user)
        } else {
            ServiceResult.Error(
                code = "USER_NOT_FOUND",
                message = "用户不存在",
                statusCode = HttpStatusCode.NotFound
            )
        }
    }

    /**
     * 刷新 Token
     * 使用 Refresh Token 生成新的 Access Token 和 Refresh Token
     */
    suspend fun refreshToken(userId: UUID): ServiceResult<TokenResponse> {
        val user = userRepository.findById(userId)

        return if (user != null) {
            // 使用 JWT 插件提供的生成器
            val newAccessToken = JwtTokenGenerator.generateAccessToken(user)
            val newRefreshToken = JwtTokenGenerator.generateRefreshToken(user)
            ServiceResult.Success(
                TokenResponse(newAccessToken, newRefreshToken)
            )
        } else {
            ServiceResult.Error(
                code = "USER_NOT_FOUND",
                message = "用户不存在",
                statusCode = HttpStatusCode.Unauthorized
            )
        }
    }

    // ===== 保留旧方法以保持向后兼容 =====

    @Deprecated("使用 register() 方法替代", ReplaceWith("register(RegisterRequest(...))"))
    suspend fun registerUser(
        nickname: String,
        email: String,
        password: String,
        longId: String?
    ): UserEntity {
        if (userRepository.findByEmail(email) != null) {
            throw IllegalArgumentException("Email already registered")
        }

        val salt = BCrypt.gensalt()
        val passwordHash = BCrypt.hashpw(password, salt)

        return userRepository.create(nickname, email, passwordHash, salt, longId)
    }

    @Deprecated("使用 login() 方法替代", ReplaceWith("login(LoginRequest(...))"))
    suspend fun authenticateUser(email: String, password: String): UserEntity? {
        val user = userRepository.findByEmail(email) ?: return null

        if (BCrypt.checkpw(password, user.passwordHash)) {
            return user
        }
        return null
    }

    @Deprecated("使用 getCurrentUser() 方法替代", ReplaceWith("getCurrentUser(uuid)"))
    suspend fun getUserById(uuid: UUID): UserEntity? {
        return userRepository.findById(uuid)
    }
}
