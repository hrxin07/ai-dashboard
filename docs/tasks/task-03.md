# Task 03：实现用户注册完整流程

**阶段：** 基础与认证  
**状态：** 已完成  
**Description：** 交付从注册页面到注册 API 再到 MySQL/MariaDB 写入的垂直功能切片，服务端用 Zod 校验输入、bcryptjs 哈希密码，并处理用户名/邮箱冲突。

## 验收标准
- [x] 用户可填写用户名、邮箱、密码和确认密码，客户端会提示明显的输入错误。
- [x] API 拒绝无效参数和重复用户名/邮箱，并使用适当状态码返回统一 JSON 格式。
- [x] 注册成功后数据库只保存密码哈希，页面引导用户进入登录流程。

## 已完成实现
- 新增响应式注册页，包含用户名、邮箱、密码、确认密码、密码显隐和客户端校验。
- 新增 `POST /api/auth/register`，使用 Zod 进行服务端校验。
- 使用 bcryptjs（12 轮）哈希密码，API 永不返回 `passwordHash`。
- 校验用户名和邮箱的唯一性，冲突时返回 `409`；非法请求返回 `400`；异常返回 `500`。
- 新增统一 JSON 成功/失败响应工具与密码工具函数。
- 注册成功后显示反馈并跳转至后续登录页（Task 04 实现）。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 已测试无效提交、有效注册、重复用户名注册；数据库验证密码为 bcrypt 哈希且非明文。

## 手动验证结果

```text
无效注册       → 400，返回字段校验提示 ✅
有效注册       → 201，返回安全用户字段 ✅
重复用户名     → 409，返回“该用户名已被使用” ✅
数据库密码字段 → bcrypt 哈希，未存储明文 ✅
```

## 依赖
[Task 02](./task-02.md)

## 主要修改文件
- `app/register/page.tsx`
- `app/api/auth/register/route.ts`
- `lib/validations/auth.ts`
- `lib/api-response.ts`
- `lib/password.ts`
- `app/globals.css`
- `package.json`
- `package-lock.json`

**实际范围：** 中等
