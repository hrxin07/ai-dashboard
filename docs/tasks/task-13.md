# Task 13：实现规则职业推荐 API 与页面

**阶段：** 工作台、推荐与交付  
**状态：** 已完成  `r`n**Description：** 基于用户兴趣、技能、规划与职业方向数据编写可解释的关键词/权重推荐服务，输出 1–3 项推荐、匹配原因、技能缺口和下一步建议，并在页面中呈现。

## 验收标准
- [x] API 仅使用当前登录用户的资料和规划，至少返回一项推荐或清晰的“请先完善资料”提示。
- [x] 推荐结果包含职业名称、匹配原因、待补充技能和下一步建议，且规则逻辑可在代码中追溯。
- [x] 页面能触发推荐并清晰展示结果、资料不足状态和返回职业方向页入口。

## 验证方式
- [x] `npm run lint` 通过。
- [x] `npm run build` 通过。
- [x] 分别填写偏模型训练、数据分析、产品方向的资料，确认结果合理且可解释。

## 依赖
[Task 06](./task-06.md)、[Task 08](./task-08.md)、[Task 09](./task-09.md)

## 可能修改的文件
- `app/api/recommendation/route.ts`
- `lib/recommendation.ts`
- `app/(protected)/recommendation/page.tsx`
- `components/recommendation-result.tsx`
- `lib/validations/recommendation.ts`

**预计范围：** 中等（3–5 个文件）


## 完成记录
- 已实施对应功能，并通过 
pm run lint 与 
pm run build 验证。

