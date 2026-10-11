import { z } from "zod";

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional();

export const profileSchema = z.object({
  realName: optionalText(40, "姓名不能超过 40 个字符"),
  major: optionalText(80, "专业不能超过 80 个字符"),
  grade: optionalText(30, "年级不能超过 30 个字符"),
  school: optionalText(120, "学校不能超过 120 个字符"),
  skills: optionalText(1000, "技能内容不能超过 1000 个字符"),
  interests: optionalText(1000, "兴趣内容不能超过 1000 个字符"),
  bio: optionalText(1200, "个人简介不能超过 1200 个字符"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
