# Task 08：完成职业规划页面与工作流

**阶段：** 个人规划闭环  
**状态：** 已完成  `r`n**Description：** 构建职业规划页面，通过表单消费规划 API，支持首次引导、回填编辑、保存反馈和更新时间展示。

## 验收标准
- [x] 未创建规划时页面提供清晰引导；创建后可展示并编辑全部规划字段。
- [x] 职业方向、目标岗位和阶段计划的必填提示清晰，保存后数据能持久化。
- [x] 页面在桌面和手机窄屏下均可阅读和提交，不出现内容遮挡。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 新用户完成首次规划，刷新后编辑并保存，核对更新时间和数据库值。

## 依赖
[Task 07](./task-07.md)

## 可能修改的文件
- `app/(protected)/career-plan/page.tsx`
- `components/career-plan-form.tsx`
- `components/empty-career-plan.tsx`
- `lib/format.ts`

**预计范围：** 小（3–4 个文件）


## 完成记录
- 已实施对应功能，并通过 
pm run lint 与 
pm run build 验证。

