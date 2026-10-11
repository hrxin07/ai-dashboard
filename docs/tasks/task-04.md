# Task 04：实现登录、JWT 与服务端访问保护

**阶段：** 基础与认证  
**状态：** 已完成  
**Description：** 建立登录 API 和登录页面，凭据验证成功后签发 JWT 并写入 HttpOnly Cookie；提供可复用的服务端取当前用户工具与路由保护。

## 验收标准
- [x] 用户可用用户名或邮箱加正确密码登录，登录后进入 `/dashboard`；错误凭据显示明确反馈。
- [x] JWT Cookie 具备 `HttpOnly`、`SameSite=Lax`，生产环境具备 `Secure` 属性，密钥从环境变量读取。
- [x] 未登录访问受保护页面或调用受保护 API 会被重定向或返回 `401`。

## 已完成实现
- 新增响应式登录页，支持用户名或邮箱登录、必填校验、密码显隐、错误提示和登录后的跳转。
- 新增 `POST /api/auth/login`：用 Zod 校验请求体，以用户名或邮箱查询用户，并以 bcryptjs 比对密码。
- 使用 `jose` 签发和验证 7 天有效期的 HS256 JWT；令牌放入 `ai_career_session` HttpOnly Cookie。
- Cookie 使用 `SameSite=Lax`、根路径和 7 天有效期，生产环境自动启用 `Secure`；JWT 密钥从 `JWT_SECRET` 环境变量读取。
- 新增 `lib/current-user.ts`，在服务端组件、路由处理器或 Server Action 中可通过 `getCurrentAuthUser()` 读取并验证当前用户。
- 使用 Next.js 16 的 `proxy.ts` 保护工作台、个人资料、职业规划、学习实践、职业方向与推荐页面；未登录 API 统一返回 `401` JSON。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 分别以有效、无效和缺失 Cookie 请求受保护接口，确认返回符合预期。

## 手动验证结果

```text
有效账号登录          → 200，返回安全用户字段并写入 HttpOnly / SameSite=Lax Cookie ✅
错误密码登录          → 401，返回“账号或密码错误” ✅
匿名访问 /dashboard   → 307，重定向至 /login?next=/dashboard ✅
匿名请求受保护 API    → 401，返回统一 JSON 错误 ✅
携带 Cookie 访问页面  → /dashboard 返回 200 ✅
已登录访问 /login     → 307，重定向至 /dashboard ✅
```

## 依赖
[Task 03](./task-03.md)

## 主要修改文件
- `app/login/page.tsx`
- `app/api/auth/login/route.ts`
- `app/dashboard/page.tsx`
- `lib/auth.ts`
- `lib/current-user.ts`
- `lib/validations/auth.ts`
- `proxy.ts`
- `app/globals.css`
- `package.json`
- `package-lock.json`

**实际范围：** 中等
