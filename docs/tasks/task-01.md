# Task 01：初始化 Next.js 项目与通用开发基线

**阶段：** 基础与认证  
**状态：** 已完成  
**Description：** 创建 TypeScript、App Router、Tailwind CSS 的 Next.js 应用，建立基础目录、环境变量样例、全局样式与质量命令，为后续全栈开发提供可运行基线。

## 验收标准
- [x] 项目可通过 `npm run dev` 启动，且首页正常响应。
- [x] 已提供 `.env.example`，包含 `DATABASE_URL` 与 `JWT_SECRET` 占位项，且真实 `.env` 文件被忽略。
- [x] 页面具有可复用的全局字体、颜色变量和基础响应式样式。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 手动启动开发服务器后访问首页，HTTP 状态为 `200` 且首页内容正常返回；已完成窄屏响应式样式配置。

## 实现内容
- 使用 Next.js 16.4.0、TypeScript、App Router、Tailwind CSS 初始化项目。
- 将项目名称更新为 `ai-career-workbench`。
- 完成品牌化首页：平台介绍、职业成长视觉区域、能力卡片、行动入口和响应式布局。
- 更新页面元数据为“人工智能专业的职业生涯规划学习实践工作台”。
- 新增 SQLite 和 JWT 环境变量模板。
- 保留 ESLint、生产构建和本地开发脚本。

## 依赖
无。

## 主要修改文件
- `package.json`
- `package-lock.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `.env.example`
- `.gitignore`
- `README.md`

**实际范围：** 中等

## 验证结果

```text
npm run lint  ✅
npm run build ✅
开发服务器   ✅ http://localhost:3001（3000 端口已有进程，因此自动使用 3001）
首页请求     ✅ HTTP 200
```


