import { z } from "zod";
const text = (max: number) => z.string().trim().max(max);
export const careerPlanSchema = z.object({
  targetDirection: text(120).min(1, "请填写目标职业方向"),
  targetPosition: text(120).min(1, "请填写目标岗位"),
  targetCity: text(80).optional(),
  targetDate: z.string().optional(),
  skillFoundation: text(1500).optional(),
  strengths: text(1500).optional(),
  weaknesses: text(1500).optional(),
  planContent: text(3000).min(1, "请填写阶段计划"),
});
export type CareerPlanInput = z.infer<typeof careerPlanSchema>;
