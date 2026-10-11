"use client";

export default function ProtectedError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="app-error"><h2>页面暂时无法加载</h2><p>请检查网络连接后重试。</p><button className="profile-save" onClick={reset}>重新加载</button></div>;
}
