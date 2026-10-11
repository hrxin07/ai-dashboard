"use client";

import { FormEvent, useEffect, useState } from "react";

type ProfileFormValues = {
  realName: string;
  major: string;
  grade: string;
  school: string;
  skills: string;
  interests: string;
  bio: string;
};

type ApiProfile = {
  realName: string | null;
  major: string | null;
  grade: string | null;
  school: string | null;
  skills: string | null;
  interests: string | null;
  bio: string | null;
};

type ApiResult<T> = { success: boolean; message: string; data: T };

const initialValues: ProfileFormValues = {
  realName: "",
  major: "人工智能",
  grade: "",
  school: "",
  skills: "",
  interests: "",
  bio: "",
};

function toFormValues(profile: ApiProfile): ProfileFormValues {
  return {
    realName: profile.realName ?? "",
    major: profile.major ?? "人工智能",
    grade: profile.grade ?? "",
    school: profile.school ?? "",
    skills: profile.skills ?? "",
    interests: profile.interests ?? "",
    bio: profile.bio ?? "",
  };
}

export function ProfileForm() {
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error">("success");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        const result = (await response.json()) as ApiResult<ApiProfile>;
        if (!response.ok || !result.success) throw new Error(result.message || "个人资料读取失败");
        if (active) setValues(toFormValues(result.data));
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : "个人资料读取失败，请刷新后重试");
          setNoticeType("error");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadProfile();
    return () => { active = false; };
  }, []);

  function updateField<K extends keyof ProfileFormValues>(field: K, value: ProfileFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    if (notice) setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setNotice("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as ApiResult<ApiProfile>;
      if (!response.ok || !result.success) throw new Error(result.message || "个人资料保存失败");
      setValues(toFormValues(result.data));
      setNotice("个人资料已保存");
      setNoticeType("success");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "个人资料保存失败，请稍后重试");
      setNoticeType("error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <section className="profile-form-section">
        <div className="profile-form-section-head"><span>01</span><div><h2>基础信息</h2><p>完善个人信息，为职业规划提供更准确的参考。</p></div></div>
        <div className="profile-grid">
          <label>姓名<input value={values.realName} onChange={(event) => updateField("realName", event.target.value)} placeholder="例如：张同学" maxLength={40} /></label>
          <label>专业<input value={values.major} onChange={(event) => updateField("major", event.target.value)} placeholder="例如：人工智能" maxLength={80} /></label>
          <label>年级<input value={values.grade} onChange={(event) => updateField("grade", event.target.value)} placeholder="例如：2024 级本科" maxLength={30} /></label>
          <label>学校<input value={values.school} onChange={(event) => updateField("school", event.target.value)} placeholder="例如：XX 大学" maxLength={120} /></label>
        </div>
      </section>

      <section className="profile-form-section">
        <div className="profile-form-section-head"><span>02</span><div><h2>能力与兴趣</h2><p>用关键词描述你当前的积累和想要探索的方向。</p></div></div>
        <div className="profile-grid profile-grid-full">
          <label>技能基础<textarea value={values.skills} onChange={(event) => updateField("skills", event.target.value)} placeholder="例如：Python、机器学习、PyTorch、数据分析" maxLength={1000} rows={4} /></label>
          <label>兴趣方向<textarea value={values.interests} onChange={(event) => updateField("interests", event.target.value)} placeholder="例如：计算机视觉、AIGC、智能机器人" maxLength={1000} rows={4} /></label>
        </div>
      </section>

      <section className="profile-form-section">
        <div className="profile-form-section-head"><span>03</span><div><h2>个人简介</h2><p>简单介绍你的学习状态、实践经历或近期目标。</p></div></div>
        <label className="profile-bio-label">个人简介<textarea value={values.bio} onChange={(event) => updateField("bio", event.target.value)} placeholder="写下你的个人简介…" maxLength={1200} rows={5} /><small>{values.bio.length}/1200</small></label>
      </section>

      {notice && <p className={`profile-notice ${noticeType}`} role="status">{notice}</p>}
      <div className="profile-actions"><span>{isLoading ? "正在读取你的资料…" : "资料仅对你的账号可见"}</span><button type="submit" className="profile-save" disabled={isLoading || isSaving}>{isSaving ? "正在保存…" : "保存个人资料"}</button></div>
    </form>
  );
}
