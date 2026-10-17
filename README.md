# 人工智能专业的职业生涯规划学习实践工作台

面向人工智能专业学生的全栈课程作业项目。系统将个人档案、职业目标、职业方向探索、学习实践任务和规则推荐整合在一个工作台中。

## 技术栈

- Next.js 16（App Router）+ TypeScript + Tailwind CSS
- Prisma 7 + MySQL/MariaDB（使用 `@prisma/adapter-mariadb`）
- JWT（`jose`）+ HttpOnly Cookie
- Zod + bcryptjs

## 已实现功能

- 用户注册、用户名/邮箱登录、JWT 会话与退出登录；
- 当前用户资料维护：姓名、专业、年级、学校、技能、兴趣、简介；
- 职业规划创建与编辑：目标方向、岗位、城市、时间、技能基础、优势、待提升能力及阶段计划；
- 六类职业方向探索：算法工程师、机器学习工程师、计算机视觉工程师、数据分析师、AIGC 应用开发工程师、AI 产品经理；
- 学习实践任务的新增、编辑、删除、完成状态切换及状态/类型/优先级筛选；
- 学习任务支持 0–100% 完成进度和多个小任务；有小任务时，主任务进度按小任务完成比例自动同步；
- 学习日历：可按日安排学习任务、查看每日待办、编辑或删除安排，并快速标记完成；
- 工作台统计、近期任务和快捷入口；工作台学习进度按全部任务的实际完成进度平均值计算；
- 基于个人资料、职业规划和职业方向关键词的可解释职业推荐。

## 环境要求

- Node.js 20.19 或更高版本
- MySQL 8 或 MariaDB 数据库服务；开发和生产均需一个业务数据库与一个独立的 shadow database。

## 本地启动

1. 安装依赖：

   ```powershell
   npm install
   ```

2. 创建环境变量文件：

   ```powershell
   Copy-Item .env.example .env
   ```

   编辑 `.env`，为 `JWT_SECRET` 配置至少 32 个字符的随机字符串。

3. 生成 Prisma Client 并应用迁移：

   ```powershell
   npm run db:generate
   npm run db:migrate:deploy
   ```

   `npm install` 也会通过 `postinstall` 自动生成 Prisma Client。如果接口提示
   `@prisma/client did not initialize yet`，重新执行 `npm run db:generate` 后再启动开发服务器。

4. 导入职业方向演示数据（重复执行不会重复插入）：

   ```powershell
   npm run db:seed
   ```

5. 启动：

   ```powershell
   npm run dev
   ```

   浏览器打开终端输出的本地地址：`http://localhost:3001`。

## 常用命令

-

pm run lint`：执行 ESLint；
-

pm run build`：创建生产构建；
-

pm run db:validate`：校验 Prisma schema；
-

pm run db:migrate -- --name <name>`：开发环境创建迁移；
-

pm run db:seed`：导入/更新职业方向种子数据。

## 数据库说明

数据库连接位于 `.env`：

```env
DATABASE_URL="mysql://username:password@127.0.0.1:3306/ai_dashboard"
SHADOW_DATABASE_URL="mysql://username:password@127.0.0.1:3306/ai_dashboard_shadow"
JWT_SECRET="替换为至少 32 个字符的随机字符串"
```

`DATABASE_URL` 指向业务数据库；`SHADOW_DATABASE_URL` 必须指向另一个空数据库，供 Prisma 在开发时安全校验迁移，二者不能相同。密码中含有 `@`、`:`、`/`、`#` 或 `%` 时，必须做 URL 编码。

## Docker 部署

项目根目录提供 `Dockerfile`，服务器端 Compose 配置位于 `stack/ai-dashboard/docker-compose.yml`（与应用仓库并列的 `stack` 目录）。GitHub Actions 部署时会先通过 migration 镜像执行 `prisma migrate deploy` 和种子数据导入，再启动 Next.js 应用镜像。

生产环境通过 GitHub Environment Secrets 注入 MySQL 连接，例如：

```env
AI_DASHBOARD_IMAGE=your-registry/ai-dashboard:latest
DATABASE_URL=mysql://username:encoded-password@mysql-host:3306/ai_dashboard
SHADOW_DATABASE_URL=mysql://username:encoded-password@mysql-host:3306/ai_dashboard_shadow
JWT_SECRET=替换为至少 32 个字符的随机字符串
```

应用容器不保存数据库文件或使用 Docker Volume；所有业务数据由 MySQL/MariaDB 持久化。若数据库同样运行在 Docker 中，URL 的主机名必须是该数据库服务在 `web` 网络中可访问的名称，不能写 `127.0.0.1`。
Compose 将宿主机 `3001` 映射到容器 `3001`。ai-dashboard 的本地和容器端口均为 `3001`，不会使用 `3000`。

服务器的 Nginx 配置位于 `stack/nginx/conf.d/default.conf`，默认使用 `ai-dashboard.test` 转发到 Docker 网络中的 `ai-dashboard:3001`。正式域名启用前，将 `server_name ai-dashboard.test` 替换为实际域名。

### GitHub Actions 部署

`.github/workflows/deploy.yml` 会在 `prod` 分支推送或手动触发时执行：构建并推送 GHCR 镜像、通过 SSH 登录服务器、执行 Prisma migration、启动 `ai-dashboard` 容器并重新加载 Nginx。服务器上的 Compose 文件路径约定为 `/opt/stack/ai-dashboard/docker-compose.yml`。

在 GitHub 的 `production` Environment 中配置以下变量和密钥：

- Variables：`SSH_HOST`、`SSH_PORT`、`SSH_USERNAME`、`SSH_KNOWN_HOSTS`、`GHCR_USERNAME`
- Secrets：`SSH_PRIVATE_KEY`、`GHCR_TOKEN`、`DATABASE_URL`、`SHADOW_DATABASE_URL`、`JWT_SECRET`

部署工作流会自动执行迁移和幂等的职业方向种子数据导入，无需手动执行 seed。

## 演示流程

1. 访问 `/register` 注册账户，再在 `/login` 登录；
2. 在“个人中心”填写技能、兴趣和个人简介；
3. 在“职业规划”填写目标方向、目标岗位与阶段计划；
4. 在“职业方向”浏览六类 AI 岗位；
5. 在“学习实践”新增任务、设置完成进度、添加多个小任务，筛选任务、标记完成并编辑或删除；
6. 回到“工作台”查看统计和近期任务；
7. 在“职业推荐”点击“生成我的推荐”，查看匹配关键词、技能缺口和下一步建议。

## 安全说明

密码仅保存 bcrypt 哈希；JWT 存入 `HttpOnly`、`SameSite=Lax` Cookie。所有个人资料、职业规划与学习任务接口都从 JWT 获取用户 ID，不接受客户端传入的用户归属字段。
