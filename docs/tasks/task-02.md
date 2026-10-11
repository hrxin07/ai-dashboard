# Task 02：配置 Prisma、SQLite 与基础数据模型

**阶段：** 基础与认证  
**状态：** 已完成  
**Description：** 安装并配置 Prisma，定义 User、Profile、CareerPlan、LearningTask、CareerPath 及相关枚举和关系，建立可复现的 SQLite 迁移基础。

## 验收标准
- [x] Prisma schema 中的关系符合“用户—资料一对一、用户—规划一对一、用户—任务一对多”。
- [x] 用户名与邮箱具有唯一约束，密码字段仅存储哈希值；CareerPath 为公共数据。
- [x] Prisma Client 可在服务端以单例方式访问，且迁移已在配置的 SQLite 数据库中执行。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 执行 SQLite 迁移后，已创建并验证核心表。

## 已完成实现
- 已安装并锁定 `prisma@6.19.0` 与 `@prisma/client@6.19.0`。
- 已创建 `prisma/schema.prisma`，定义 `User`、`Profile`、`CareerPlan`、`LearningTask`、`CareerPath` 以及任务枚举。
- 已创建 SQLite 初始迁移：`prisma/migrations/20261007000000_init/migration.sql`。
- 已实现 Prisma Client 开发环境单例：`lib/prisma.ts`。
- 已添加 `db:validate`、`db:generate`、`db:migrate` npm 脚本，并完善 SQLite 环境变量样例与 README。
- 已执行 `npm run db:validate`、`npm run db:generate`，均成功。

## SQLite 配置结果
- 已将 Prisma datasource 从 MySQL 切换为 SQLite。
- 已创建本地数据库文件 `prisma/dev.db`。
- 已执行并应用初始迁移，核心表和索引已创建。

## 依赖
[Task 01](./task-01.md)

## 主要修改文件
- `prisma/schema.prisma`
- `prisma/migrations/20261007000000_init/migration.sql`
- `prisma/migrations/migration_lock.toml`
- `prisma.config.ts`
- `lib/prisma.ts`
- `package.json`
- `package-lock.json`
- `.env.example`
- `README.md`

**实际范围：** 中等

## 验证结果

```text
npm run db:validate ✅
npm run db:generate ✅
npm run lint        ✅
npm run build       ✅
SQLite 实际迁移       ✅ prisma/dev.db 已完成
```



