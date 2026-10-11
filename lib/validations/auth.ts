import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, "用户名至少需要 2 个字符")
      .max(20, "用户名不能超过 20 个字符")
      .regex(/^[\p{L}\p{N}_-]+$/u, "用户名仅支持中文、字母、数字、下划线和连字符"),
    email: z.string().trim().email("请输入有效的邮箱地址").max(255, "邮箱地址过长"),
    password: z.string().min(6, "密码至少需要 6 位").max(72, "密码不能超过 72 位"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  account: z.string().trim().min(1, "请输入用户名或邮箱").max(255, "账号过长"),
  password: z.string().min(1, "请输入密码").max(72, "密码过长"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
