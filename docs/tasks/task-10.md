# Task 10：实现学习实践任务 API

**阶段：** 职业探索与学习实践  
**状态：** 已完成

## 目标
为当前登录用户提供学习任务 CRUD，并支持任务完成进度和多个小任务。小任务存在时，主任务进度按已完成小任务数自动计算；没有小任务时使用主任务进度。

## 验收标准
- [x] 支持任务列表、创建、更新、删除，以及状态、类型、优先级筛选。
- [x] 支持 `progress`（0–100）和 `subtasks`（标题、完成状态、排序）。
- [x] 小任务完成比例自动同步到主任务进度，并同步 TODO、IN_PROGRESS、COMPLETED 状态。
- [x] 所有查询和变更均按 JWT 用户归属校验，无法访问其他用户任务。
- [x] 删除任务时级联删除其小任务。

## 验证方式
- [x] `npm run db:generate`、`npm run db:validate`、`npm run lint`、`npm run build` 通过。
- [x] 验证创建 3 个小任务时进度为 0，完成 1 个时为 33，全部完成时为 100。

## 依赖
[Task 02](./task-02.md)、[Task 04](./task-04.md)

## 主要文件
- `prisma/schema.prisma`
- `app/api/tasks/route.ts`
- `app/api/tasks/[id]/route.ts`
- `lib/validations/task.ts`
- `lib/task-progress.ts`
