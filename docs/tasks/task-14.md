# Task 14：完成响应式、异常状态、README 与演示准备

**阶段：** 工作台、推荐与交付  
**状态：** 已完成

## 验收标准
- [x] 登录、工作台、个人资料、规划、职业方向、任务和推荐页面适配桌面与手机窄屏。
- [x] 主要 API 失败、无数据和提交结果具有可理解的提示。
- [x] README 说明安装、环境变量、SQLite、Prisma 迁移、种子数据、启动和演示方法。
- [x] README 说明学习任务支持进度和多个小任务，且进度可自动同步。
- [x] 提供 Dockerfile 与服务器端 Compose 配置，支持 SQLite 数据卷持久化、迁移和生产环境变量注入；已在服务器完成 Docker 构建、部署和 SQLite 可写性验证。
- [x] ai-dashboard 本地、宿主机和容器内端口统一固定为 `3001`，不使用 `3000`。
- [x] 提供 GitHub Actions 镜像发布与 SSH 部署流程，以及 Nginx 到 `ai-dashboard:3001` 的反向代理配置。
- [x] SQLite 数据卷在非 root 应用用户下可写，容器启动时自动修复 Volume 权限，已在服务器重新部署并验证注册写入。

## 验证方式
- [x] `npm run lint`、`npm run build`、`npm run db:validate` 通过。

## 主要文件
- `README.md`
- `app/globals.css`
- `app/(protected)/learning/page.tsx`
- `app/(protected)/dashboard/page.tsx`
