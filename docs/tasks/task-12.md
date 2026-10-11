# Task 12：实现工作台统计与概览页面

**阶段：** 工作台、推荐与交付  
**状态：** 已完成

## 验收标准
- [x] 展示当前用户、职业目标、任务总数、进行中数量、已完成数和完成率。
- [x] 近期任务展示主任务进度和小任务完成数量。
- [x] 空任务时完成率为 0%，不产生异常，并提供任务管理入口。

## 验证方式
- [x] `npm run lint` 与 `npm run build` 通过。
- [x] 工作台接口返回进度及小任务摘要，页面显示进度条。

## 依赖
[Task 08](./task-08.md)、[Task 11](./task-11.md)

## 主要文件
- `app/(protected)/dashboard/page.tsx`
- `app/api/dashboard/route.ts`
