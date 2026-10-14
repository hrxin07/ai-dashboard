# Task 02：配置 Prisma、MySQL/MariaDB 与基础数据模型

**阶段：** 基础与认证  
**状态：** 已完成  
**Description：** 配置 Prisma 7、MySQL/MariaDB driver adapter，定义 User、Profile、CareerPlan、LearningTask、CareerPath 及相关枚举和关系，建立可复现的 MySQL 初始迁移基础。

## 验收标准
- [x] Prisma schema 中的关系符合“用户—资料一对一、用户—规划一对一、用户—任务一对多”。
- [x] 用户名与邮箱具有唯一约束，密码字段仅存储哈希值；CareerPath 为公共数据。
- [x] Prisma Client 可在服务端以 MariaDB adapter 的单例方式访问；迁移由生产工作流在配置的 MySQL/MariaDB 数据库中执行。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] `npm run db:validate` 和 `npm run db:generate` 已验证 schema 与 Client；核心表由 MySQL 初始迁移创建。

## 已完成实现
- 已安装并锁定 `prisma@7.10.0`、`@prisma/client@7.10.0` 与 `@prisma/adapter-mariadb@7.10.0`。
- 已创建 `prisma/schema.prisma`，定义 `User`、`Profile`、`CareerPlan`、`LearningTask`、`CareerPath` 以及任务枚举。
- 已提供单一 MySQL 初始迁移：`prisma/migrations/20261012000000_init_mysql/migration.sql`。
- 已实现 Prisma Client 开发环境单例和 MariaDB adapter：`lib/prisma.ts`、`lib/prisma-adapter.ts`。
- 已添加 `db:validate`、`db:generate`、`db:migrate` npm 脚本，并完善 MySQL/MariaDB 环境变量样例与 README。
- 已添加 `postinstall` 自动执行 `prisma generate`，避免重新安装依赖后 Prisma Client 未初始化。
- 已执行 `npm run db:validate`、`npm run db:generate`，均成功。

## MySQL/MariaDB 配置结果
- Prisma datasource 使用 `mysql`，连接 URL 集中在 `prisma.config.ts`。
- `DATABASE_URL` 指向业务库，`SHADOW_DATABASE_URL` 指向不同的 shadow database。
- 本地文件数据库和旧迁移已移除；新库首次部署时应用初始迁移并创建核心表和索引。

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
MySQL/MariaDB schema  ✅ `npm run db:validate`、`npm run db:generate` 已完成
```



