import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
  return (
    <div className="profile-page">
      <header className="profile-page-head">
        <div><p className="profile-kicker">PERSONAL PROFILE</p><h1>个人中心</h1><p>建立完整的个人档案，让职业规划更贴近你的成长方向。</p></div>
        <div className="profile-page-badge"><span>✦</span><p>从认识自己<br />开始规划未来</p></div>
      </header>
      <ProfileForm />
    </div>
  );
}
