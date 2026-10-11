"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FieldErrors = { account?: string; password?: string };

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12s3.3-5.5 9-5.5S21 12 21 12s-3.3 5.5-9 5.5S3 12 3 12Zm9 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 6.7A9.2 9.2 0 0 1 12 6.5c5.7 0 9 5.5 9 5.5a15.1 15.1 0 0 1-3 3.5M6.1 6.1A15.1 15.1 0 0 0 3 12s3.3 5.5 9 5.5c1.2 0 2.3-.2 3.3-.7M9.9 9.9a3 3 0 0 0 4.2 4.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    if (!account.trim()) nextErrors.account = "请输入用户名或邮箱";
    if (!password) nextErrors.password = "请输入密码";
    setErrors(nextErrors);
    setNotice("");
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account, password }),
      });
      const result = (await response.json()) as { success: boolean; message: string };
      if (!response.ok || !result.success) {
        setNotice(result.message || "账号或密码错误");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setNotice("网络连接异常，请检查后重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <Link href="/" className="auth-brand" aria-label="返回首页"><span className="auth-brand-mark">✦</span><span>职业规划工作台</span></Link>
        <div className="auth-intro-copy">
          <p className="auth-kicker">AI CAREER GROWTH PLATFORM</p>
          <h1>继续前行，<br /><i>让成长看得见。</i></h1>
          <p>回到你的职业成长档案，继续完成每一个学习目标与实践计划。</p>
        </div>
        <div className="auth-orbit" aria-hidden="true"><span>AI</span><b>探索 · 规划 · 成长</b></div>
        <p className="auth-caption">人工智能专业的职业生涯规划学习实践工作台</p>
      </section>

      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-card">
          <Link href="/" className="auth-back">← 返回首页</Link>
          <header><p className="auth-overline">WELCOME BACK</p><h2 id="login-title">欢迎回来</h2><p>登录后继续你的职业成长之旅</p></header>
          <form noValidate onSubmit={handleSubmit}>
            <label htmlFor="account">用户名或邮箱</label>
            <input id="account" name="account" autoComplete="username" value={account} onChange={(event) => { setAccount(event.target.value); setErrors((current) => ({ ...current, account: undefined })); setNotice(""); }} placeholder="请输入用户名或邮箱" aria-invalid={Boolean(errors.account)} aria-describedby={errors.account ? "account-error" : undefined} />
            {errors.account && <p className="field-error" id="account-error">{errors.account}</p>}
            <label htmlFor="password">密码</label>
            <div className="password-field"><input id="password" name="password" autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })); setNotice(""); }} placeholder="请输入密码" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "password-error" : undefined} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "隐藏密码" : "显示密码"}><EyeIcon visible={showPassword} /></button></div>
            {errors.password && <p className="field-error" id="password-error">{errors.password}</p>}
            {notice && <p className="form-notice" role="status">{notice}</p>}
            <button className="auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "正在登录…" : "登录 →"}</button>
          </form>
          <p className="auth-switch">还没有账号？ <Link href="/register">立即注册</Link></p>
        </div>
      </section>
    </main>
  );
}




