# CLAUDE.md - 项目指南

本文件为 Claude Code 在此项目工作时提供指导。

## 项目概述

这是一个基于 Ktor 的后端服务器，用于二次创作作品集合平台（"Makeine Fanworks Collections"）。使用 Kotlin 编写，采用 PostgreSQL 数据库和 Redis 缓存。项目遵循 Ktor 应用的模块化插件架构。

## 构建与运行命令

```bash
# 运行开发服务器
./gradlew run

# 运行测试
./gradlew test

# 构建项目
./gradlew build

# 构建包含所有依赖的 Fat JAR
./gradlew buildFatJar

# 构建 Docker 镜像
./gradlew buildImage

# 将 Docker 镜像发布到本地仓库
./gradlew publishImageToLocalRegistry

# 使用 Docker 运行
./gradlew runDocker
```

服务器默认运行在端口 19327（可在 `application.yaml` 中配置）。

## 项目架构

### 应用程序初始化顺序

**关键**：`Application.kt` 中的初始化顺序至关重要。必须首先调用 `configureKoin()`，以便在任何其他插件之前设置依赖注入，因为所有其他组件都依赖于 Koin 提供的依赖。

```kotlin
fun Application.module() {
    // 1. 依赖注入（必须首先调用）
    configureKoin()

    // 2. 全局异常处理
    configureStatusPages()

    // 3. 其他插件
    configureAsyncApiDocument()
    configureAuthenticationJwt()
    configureCallLogging()
    configureCors()
    configureSimpleCache()
    configureSSE()
    configureTask()

    // 4. 事件总线初始化
    EventBus.init(workerCount = 4)
}
```

### 依赖注入（Koin）

应用使用 Koin 进行依赖注入，包含多个模块：

- **BaseModule** (`com.misaka.di.BaseModule`)：核心基础设施（数据库、Redis、日志记录器）
- **AuthModule** (`com.misaka.di.AuthModule`)：认证服务（用户仓库、用户服务、令牌服务）

所有模块在 `configureKoin()` 中注册。应用配置作为单例注入，以解决本地运行时 Koin 找不到 Application 实例的问题。

### 数据访问层（Exposed ORM）

使用 Exposed ORM 配合自定义基础模式模式：

- **BaseUUIDTable**：基于 UUID 的表基类，自动包含 `createdAt`、`updatedAt`、`deletedAt` 字段
- **BaseIntTable**：基于 Int 的表基类，自动包含 `createdAt`、`updatedAt`、`deletedAt` 字段
- **BaseUUIDEntity**：所有 UUID 实体的基类
- **BaseIntEntity**：所有 Int 实体的基类

所有域表（User、Article、Tag、Category、SubjectPost、ArticleTag）都扩展相应的基类，确保一致性。

### 事件驱动架构

应用包含自定义事件总线（`com.misaka.events.EventBus`），用于处理异步/同步事件：

- 使用可配置的工作线程初始化（默认：4）
- 事件实现 `HandleableEvent` 接口
- 支持同步和异步事件处理
- 现有事件：`UserRegistered`、`UserLoggedIn`

添加新事件：创建实现 `HandleableEvent` 的数据类，并覆盖 `handle()` 方法。

### 配置管理

配置通过 `application.yaml` 管理（未提交）。使用 `application.example.yaml` 作为模板：

- **Database**：PostgreSQL 连接设置
- **Redis**：两个连接（默认、任务调度）
- **JWT**：认证配置（域、受众、领域、密钥、有效期）
- **Ktor**：端口和模块设置

### 插件架构

应用使用在 `com.misaka.plugins` 中组织的 Ktor 插件：

- **Cors**：跨域资源共享
- **AsyncApiDocument**：API 文档
- **SimpleCache**：内存缓存
- **SSE**：服务器发送事件
- **CallLogging**：请求日志记录
- **Task**：任务调度（Redis 后端）
- **AuthenticationJwt**：基于 JWT 的认证
- **StatusPages**：全局异常处理
- **Koin**：依赖注入设置

### 路由层架构

路由在 `com.misaka.routes` 中组织：

- **GlobalRoute.kt** (`loadRoutes()`)：设置速率限制并注册路由模块
- **AuthRoutes.kt**：认证端点（登录、注册等）

速率限制全局配置，使用 TokenBucket 算法（容量 1000，速率 1 秒）。

#### 路由层设计原则（最佳实践）

1. **职责最小化**：路由层仅负责：
   - 接收 HTTP 请求
   - 参数验证和反序列化
   - 调用 Service 层
   - 返回 HTTP 响应

2. **业务逻辑下沉**：所有业务逻辑应在 Service 层处理：
   - 数据验证
   - 业务规则检查
   - 事件发布
   - 数据转换

3. **统一错误处理**：
   - 异常通过 StatusPages 全局处理
   - 返回标准 `ErrorResponse` 格式

4. **使用 ServiceResult**：Service 返回 `ServiceResult<T>` 类型，Router 层使用 `respondResult()` 统一处理

### 服务层模式

服务遵循仓库模式：

- **Repository**：数据访问层（如 `UserRepository`）
- **Service**：业务逻辑层（如 `UserService`）
- **TokenService**：JWT Token 生成和验证

服务通过 Koin 注入，消费仓库。

#### Service 层责任

1. **输入验证**：检查请求参数的有效性
2. **业务规则**：实现核心业务逻辑
3. **数据操作**：调用 Repository 进行 CRUD
4. **事件发布**：发布领域事件
5. **结果封装**：返回 `ServiceResult<T>` 类型

### 通用基础设施

#### ServiceResult<T>

统一的 Service 层返回类型：

```kotlin
sealed class ServiceResult<out T> {
    data class Success<T>(val data: T) : ServiceResult<T>()
    data class Error(
        val code: String,
        val message: String,
        val statusCode: HttpStatusCode = HttpStatusCode.BadRequest
    ) : ServiceResult<Nothing>()
}
```

#### ErrorResponse

API 错误响应格式：

```kotlin
@Serializable
data class ErrorResponse(
    val code: String,        // 错误代码
    val message: String,     // 人类可读的错误信息
    val timestamp: Long      // 时间戳
)
```

#### Router 层扩展函数

常用的扩展函数位于 `com.misaka.common.RouteExtensions.kt`：

- `ApplicationCall.getUserIdFromJWT(): UUID?`：从 JWT 提取用户 ID
- `ApplicationCall.getTokenType(): String?`：获取 Token 类型
- `ApplicationCall.respondResult<T>(result: ServiceResult<T>)`：统一处理 ServiceResult

## 技术栈

- **Kotlin**：2.2.20，JVM 工具链 17
- **Ktor**：3.2.3（服务器框架）
- **Exposed**：0.61.0（ORM）
- **Koin**：4.1.0（依赖注入）
- **PostgreSQL**：生产数据库
- **Redis**：缓存和任务调度（Lettuce 客户端）
- **JWT**：认证（`ktor-server-auth-jwt`）
- **H2**：测试数据库

## 重要提示

- 必须复制 `application.example.yaml` 到 `application.yaml` 并配置后再运行
- 数据库迁移不自动化；Schema 变更需要谨慎操作
- EventBus 必须在 Koin 设置后初始化
- Logger 实例通过 Koin 使用 `LoggerType` 枚举限定符提供
- Redis 连接提供同步（`RedisCommands`）和异步（`RedisAsyncCommands`）API

## 代码组织规范

### 包结构

```
com.misaka
├── Application.kt              # 应用入口
├── common/                     # 通用工具
│   ├── ServiceResult.kt        # 统一返回类型
│   ├── ErrorResponse.kt        # 错误响应 DTO
│   └── RouteExtensions.kt      # Router 扩展函数
├── di/                         # 依赖注入模块
│   ├── BaseModule.kt           # 基础设施
│   └── AuthModule.kt           # 认证模块
├── events/                     # 事件总线
├── plugins/                    # Ktor 插件
├── repository/                 # 数据访问层
├── routes/                     # 路由层
├── schema/                     # 数据模型
├── service/                    # 业务逻辑层
└── [other modules]/            # 其他模块
```

### 命名约定

- **Table 类**：使用 `UserTable`、`ArticleTable` 等
- **Entity 类**：使用 `UserEntity`、`ArticleEntity` 等
- **Service 类**：使用 `UserService`、`ArticleService` 等
- **Repository 类**：使用 `UserRepository`、`ArticleRepository` 等
- **DTO 类**：使用 `RegisterRequest`、`LoginResponse` 等

### 文件命名

- 使用 PascalCase 命名类文件
- 一个文件通常只包含一个类（除了 DTO 和相关的小类型）
- Schema 文件按实体命名（`User.kt`、`Article.kt` 等）

## 常见开发任务

### 添加新的 Service 和 Repository

1. 在 `schema/` 中创建数据模型，继承 `BaseUUIDTable` 或 `BaseIntTable`
2. 在 `repository/` 中创建 Repository，提供数据访问方法
3. 在 `service/` 中创建 Service，实现业务逻辑，返回 `ServiceResult<T>`
4. 在 `di/` 中创建新模块或在现有模块注册
5. 在 `routes/` 中创建路由处理器

### 添加新的 API 端点

1. 在 `service/` 中添加相应的 Service 方法
2. 在 `routes/` 中添加路由处理器
3. 路由处理器仅负责参数接收和响应返回
4. 所有业务逻辑应在 Service 中实现

### 处理异常

异常由全局异常处理器（`configureStatusPages()`）统一处理。只需在 Service 层返回 `ServiceResult.Error`，或抛出异常，它会被自动捕获并转换为标准的 `ErrorResponse`。

## 最佳实践清单

- [ ] 所有 Schema 表继承 `BaseUUIDTable` 或 `BaseIntTable`
- [ ] Repository 只做数据访问，不包含业务逻辑
- [ ] Service 返回 `ServiceResult<T>` 类型
- [ ] Router 层尽可能简洁，不包含业务逻辑
- [ ] 使用依赖注入获取 Service 和 Repository
- [ ] 异常通过返回 `ServiceResult.Error` 或抛出异常处理
- [ ] 在 Service 层发布领域事件
- [ ] 使用统一的错误代码（如 "VALIDATION_ERROR"、"EMAIL_EXISTS" 等）
- [ ] 为公共方法添加 KDoc 文档
- [ ] 使用中文变量名和类名（如果项目全部使用中文）

## 性能优化指南

### 缓存

使用 Redis 缓存频繁访问的数据（如用户信息）。在 Service 层的 TODO 注释中提供了缓存位置。

### 数据库查询

- 使用 Exposed 的查询优化器
- 避免 N+1 查询问题
- 在关联关系上使用适当的加载策略

### 异步处理

- 使用 suspend 函数进行异步数据库操作
- 使用 EventBus 发布异步事件

## 调试和日志

日志通过 Koin 注入，使用 `LoggerType` 枚举限定符。在代码中使用适当的日志级别（INFO、WARN、ERROR）。

## 相关文档

- [Ktor 官方文档](https://ktor.io/)
- [Exposed 官方文档](https://github.com/JetBrains/Exposed)
- [Koin 官方文档](https://insert-koin.io/)
