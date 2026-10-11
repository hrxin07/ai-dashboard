# Task 09：导入职业方向种子数据并实现展示页面

**阶段：** 职业探索与学习实践  
**状态：** 已完成  `r`n**Description：** 创建 CareerPath 种子脚本，至少预置 6 类人工智能职业方向，并提供只读查询 API 和卡片式职业方向页面。

## 验收标准
- [x] 种子脚本可重复执行且不会产生重复职业方向数据。
- [x] 页面至少展示算法工程师、机器学习工程师、计算机视觉工程师、数据分析师、AIGC 应用开发工程师、AI 产品经理。
- [x] 每张卡片展示简介、核心技能、推荐课程、典型项目、发展建议和标签中的主要信息。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 执行 seed 后请求 API、浏览页面，确认数量、内容和标签正常。

## 依赖
[Task 02](./task-02.md)、[Task 05](./task-05.md)

## 可能修改的文件
- `prisma/seed.ts`
- `app/api/career-paths/route.ts`
- `app/(protected)/career-paths/page.tsx`
- `components/career-path-card.tsx`
- `package.json`

**预计范围：** 中等（3–5 个文件）


## 完成记录
- 已实施对应功能，并通过 
pm run lint 与 
pm run build 验证。

