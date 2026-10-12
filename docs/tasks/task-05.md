# Task 05：建立应用壳、当前用户接口与退出登录

**阶段：** 基础与认证  
**状态：** 已完成  
**Description：** 创建已登录页面共用的导航布局，提供读取当前用户的 API 与退出登录操作，让认证状态能被页面显示并安全地结束。

## 验收标准
- [x] 受保护页面具有统一导航，包含工作台、职业规划、职业方向、学习实践、个人中心及退出入口。
- [x] `/api/auth/me` 只返回当前已认证用户的安全字段，不返回密码哈希。
- [x] 退出后认证 Cookie 被清除，访问受保护页面将回到登录页。

## 已完成实现
- 使用路由组 `app/(protected)` 建立已登录应用壳，不改变原有 URL。
- 新增侧边导航，提供工作台、职业规划、职业方向、学习实践、个人中心入口，并突出显示当前路由。
- 导航中展示已认证用户的用户名、邮箱和首字母头像；在手机端自动切换为底部导航。
- 新增 `GET /api/auth/me`，复用服务端当前用户工具，仅返回 `id`、`username`、`email` 三个安全字段。
- 新增 `POST /api/auth/logout`，以与登录一致的 Cookie 属性过期 `ai_career_session`，彻底清除会话。
- 退出按钮完成请求后替换到登录页并刷新客户端路由状态。
- 移除 Next.js 16 Cache Components 与 Partial Prefetching 配置，使读取 Cookie 的受保护布局按普通动态服务端渲染运行，避免生产环境出现 `ERROR_DYNAMIC_SERVER_USAGE`。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 登录后验证导航和用户名显示，点击退出后刷新 `/dashboard` 确认无法继续访问。

## 手动验证结果

```text
携带登录 Cookie 请求 GET /api/auth/me   → 200，仅返回 id / username / email ✅
匿名请求 GET /api/auth/me               → 401，返回统一未登录 JSON ✅
登录后访问 /dashboard                   → 200，页面包含统一导航与用户名 ✅
POST /api/auth/logout                   → 200，Set-Cookie 带 Max-Age=0 和过期时间 ✅
退出后再访问 /dashboard                 → 307，重定向至 /login?next=/dashboard ✅
```

## 依赖
[Task 04](./task-04.md)

## 主要修改文件
- `app/(protected)/layout.tsx`
- `app/(protected)/dashboard/page.tsx`
- `components/app-nav.tsx`
- `app/api/auth/me/route.ts`
- `app/api/auth/logout/route.ts`
- `app/globals.css`

**实际范围：** 中等
