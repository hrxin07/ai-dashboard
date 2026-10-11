"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FieldName = keyof FormValues;
type FieldErrors = Partial<Record<FieldName, string>>;

const initialValues: FormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.username.trim().length < 2) {
    errors.username = "用户名至少需要 2 个字符";
  } else if (values.username.trim().length > 20) {
    errors.username = "用户名不能超过 20 个字符";
  } else if (!/^[\p{L}\p{N}_-]+$/u.test(values.username.trim())) {
    errors.username = "仅支持中文、字母、数字、下划线和连字符";
  }

  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "请输入有效的邮箱地址";
  }

  if (values.password.length < 6) {
    errors.password = "密码至少需要 6 位";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "两次输入的密码不一致";
  }

  return errors;
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.3-5.5 9-5.5S21 12 21 12s-3.3 5.5-9 5.5S3 12 3 12Zm9 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 6.7A9.2 9.2 0 0 1 12 6.5c5.7 0 9 5.5 9 5.5a15.1 15.1 0 0 1-3 3.5M6.1 6.1A15.1 15.1 0 0 0 3 12s3.3 5.5 9 5.5c1.2 0 2.3-.2 3.3-.7M9.9 9.9a3 3 0 0 0 4.2 4.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function updateValue(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field] || notice) {
      setErrors((current) => ({ ...current, [field]: undefined }));
      setNotice("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setNotice("");

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as { success: boolean; message: string };

      if (!response.ok || !result.success) {
        setNotice(result.message || "注册失败，请稍后重试");
        return;
      }

      setValues(initialValues);
      setNotice("注册成功！正在为你跳转至登录页…");
      window.setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch {
      setNotice("网络连接异常，请检查后重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <Link href="/" className="auth-brand" aria-label="返回首页">
          <span className="auth-brand-mark">✦</span>
          <span>职业规划工作台</span>
        </Link>
        <div className="auth-intro-copy">
          <p className="auth-kicker">AI CAREER GROWTH PLATFORM</p>
          <h1>从这里开始，<br /><i>走向更清晰的未来。</i></h1>
          <p>建立你的 AI 职业成长档案，让学习、项目和目标都拥有清晰的方向。</p>
        </div>
        <div className="auth-orbit" aria-hidden="true"><span>AI</span><b>探索 · 规划 · 成长</b></div>
        <p className="auth-caption">人工智能专业的职业生涯规划学习实践工作台</p>
      </section>

      <section className="auth-panel" aria-labelledby="register-title">
        <div className="auth-card">
          <Link href="/" className="auth-back">← 返回首页</Link>
          <header>
            <p className="auth-overline">CREATE ACCOUNT</p>
            <h2 id="register-title">创建你的账号</h2>
            <p>开始记录属于你的职业成长路径</p>
          </header>

          <form noValidate onSubmit={handleSubmit}>
            <label htmlFor="username">用户名</label>
            <input id="username" name="username" autoComplete="username" value={values.username} onChange={(event) => updateValue("username", event.target.value)} placeholder="请输入用户名" aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? "username-error" : undefined} />
            {errors.username && <p className="field-error" id="username-error">{errors.username}</p>}

            <label htmlFor="email">邮箱</label>
            <input id="email" name="email" autoComplete="email" value={values.email} onChange={(event) => updateValue("email", event.target.value)} placeholder="name@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}

            <label htmlFor="password">密码</label>
            <div className="password-field">
              <input id="password" name="password" autoComplete="new-password" type={showPassword ? "text" : "password"} value={values.password} onChange={(event) => updateValue("password", event.target.value)} placeholder="至少 6 位字符" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "隐藏密码" : "显示密码"}><EyeIcon visible={showPassword} /></button>
            </div>
            {errors.password && <p className="field-error" id="password-error">{errors.password}</p>}

            <label htmlFor="confirmPassword">确认密码</label>
            <div className="password-field">
              <input id="confirmPassword" name="confirmPassword" autoComplete="new-password" type={showConfirmPassword ? "text" : "password"} value={values.confirmPassword} onChange={(event) => updateValue("confirmPassword", event.target.value)} placeholder="请再次输入密码" aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined} />
              <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "隐藏密码" : "显示密码"}><EyeIcon visible={showConfirmPassword} /></button>
            </div>
            {errors.confirmPassword && <p className="field-error" id="confirm-password-error">{errors.confirmPassword}</p>}

            {notice && <p className={notice.startsWith("注册成功") ? "form-notice success" : "form-notice"} role="status">{notice}</p>}
            <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "正在创建账号…" : "创建账号 →"}</button>
          </form>

          <p className="auth-switch">已有账号？ <Link href="/login">立即登录</Link></p>
        </div>
      </section>
    </main>
  );
}

