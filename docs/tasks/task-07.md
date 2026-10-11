# Task 07：实现职业规划 API 与数据归属校验

**阶段：** 个人规划闭环  
**状态：** 已完成  `r`n**Description：** 实现主职业规划的读取、创建和更新接口，并在服务端校验职业方向、目标岗位和阶段计划等关键字段，确保每位用户只维护自己的规划。

## 验收标准
- [x] `/api/career-plan` 支持当前用户规划的读取与首次创建，缺失必填字段会返回 `400`。
- [x] 更新接口仅允许更新 JWT 所属用户的规划；无记录或非本人资源不得泄露数据。
- [x] 规划数据涵盖目标、技能基础、优势、待提升能力与阶段计划字段。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 通过接口创建、读取、更新规划；切换账户后确认无法读取前一账户数据。

## 依赖
[Task 02](./task-02.md)、[Task 04](./task-04.md)

## 可能修改的文件
- `app/api/career-plan/route.ts`
- `app/api/career-plan/[id]/route.ts`
- `lib/validations/career-plan.ts`
- `lib/current-user.ts`

**预计范围：** 小（3–4 个文件）


## 完成记录
- 已实施对应功能，并通过 
pm run lint 与 
pm run build 验证。

