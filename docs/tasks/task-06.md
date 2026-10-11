# Task 06：实现个人资料 API 与个人中心页面

**阶段：** 个人规划闭环  
**状态：** 已完成  
**Description：** 提供当前用户个人资料的读取和更新接口，并完成可保存姓名、专业、年级、学校、技能、兴趣和简介的个人中心。

## 验收标准
- [x] 首次进入个人中心可看到空状态或默认专业“人工智能”，已有资料可正确回填。
- [x] 用户修改资料后刷新页面仍可读到保存结果，成功或失败均有可见提示。
- [x] API 只读取和更新 JWT 对应用户的资料，不能通过请求参数修改他人资料。

## 已完成实现
- 新增 `GET /api/profile` 和 `PUT /api/profile`，使用 JWT 当前用户 ID 访问 `Profile`，不接收用户 ID 参数。
- 资料首次读取时返回默认专业“人工智能”；保存时使用 Prisma `upsert`，支持创建和更新同一账号的资料。
- 新增 Zod 字段长度校验，覆盖姓名、专业、年级、学校、技能、兴趣和个人简介。
- 新增 `/profile` 个人中心页面，支持资料读取回填、编辑、保存、加载状态和成功/失败反馈。
- 完成桌面端表单卡片与移动端响应式布局。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 使用两个账号验证资料默认值、保存回填、非法长度提示和未登录拦截；接口始终从 JWT 读取用户归属。

## 手动验证结果

```text
首次 GET /api/profile       → 200，返回默认专业“人工智能”，其余资料为空 ✅
保存资料 PUT /api/profile   → 200，返回已保存的个人资料 ✅
再次 GET /api/profile       → 200，资料正确回填 ✅
非法长度 PUT               → 400，返回字段校验提示 ✅
匿名 GET /api/profile       → 401，返回统一未登录 JSON ✅
第二账号首次读取           → 200，空资料且 userId 不同，数据未串联 ✅
```

## 依赖
[Task 05](./task-05.md)

## 主要修改文件
- `app/(protected)/profile/page.tsx`
- `app/api/profile/route.ts`
- `components/profile-form.tsx`
- `lib/validations/profile.ts`
- `app/globals.css`

**实际范围：** 中等
