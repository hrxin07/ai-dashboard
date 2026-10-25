"use client";

import Link from "next/link";
import { StudyCalendar } from "@/components/study-calendar";
import { useEffect, useState } from "react";

type DashboardData = {
  username: string;
  plan: { targetDirection: string; targetPosition: string } | null;
  tasks: {
    id: string;
    title: string;
    status: string;
    progress: number;
    deadline: string | null;
    priority: string;
    subtasks: { completed: boolean }[];
  }[];
  total: number;
  completed: number;
  learningProgress: number;
  completionRate: number;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: DashboardData;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setError(null);

      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        const result = (await response.json()) as ApiResponse;

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.message ?? "工作台数据读取失败，请稍后重试");
        }

        if (!cancelled) setData(result.data);
      } catch (error) {
        if (cancelled) return;

        setData(null);
        setError(
          error instanceof Error
            ? error.message
            : "工作台数据读取失败，请稍后重试",
        );
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [requestVersion]);

  if (error)
    return (
      <div className="dashboard-page">
        <p className="empty-state">{error}</p>
        <button
          className="button button-primary dashboard-retry"
          onClick={() => setRequestVersion((version) => version + 1)}
          type="button"
        >
          重新加载
        </button>
      </div>
    );

  if (!data)
    return (
      <div className="dashboard-page">
        <p className="empty-state">正在加载工作台…</p>
      </div>
    );

  return (
    <div className="dashboard-page">
      <header>
        <p className="profile-kicker">YOUR WORKBENCH</p>
        <h1>你好，{data.username}</h1>
        <p>今天也向你的职业目标迈进一步。</p>
      </header>
      <section className="dashboard-goal">
        <div>
          <span>当前目标</span>
          <h2>
            {data.plan
              ? `${data.plan.targetDirection} · ${data.plan.targetPosition}`
              : "暂未设置职业目标"}
          </h2>
        </div>
        <Link href="/career-plan">{data.plan ? "编辑规划" : "创建规划"} →</Link>
      </section>
      <section className="stats-grid">
        <article>
          <span>任务总数</span>
          <strong>{data.total}</strong>
        </article>
        <article>
          <span>已完成</span>
          <strong>{data.completed}</strong>
        </article>
        <article>
          <span>学习进度</span>
          <strong>{data.learningProgress}%</strong>
        </article>
      </section>
      <StudyCalendar />
      <section className="dashboard-bottom">
        <div className="upcoming">
          <div className="task-list-head">
            <h2>近期任务</h2>
            <Link href="/learning">管理任务</Link>
          </div>
          {data.tasks.length ? (
            data.tasks.map((task) => (
              <div className="upcoming-row" key={task.id}>
                <span
                  className={
                    task.status === "COMPLETED" ? "done-dot" : "todo-dot"
                  }
                ></span>
                <div>
                  <strong>{task.title}</strong>
                  <small>
                    {task.deadline
                      ? `截止 ${task.deadline.slice(0, 10)}`
                      : "暂未设置截止日期"}{" "}
                    · {task.progress}%
                    {task.subtasks.length
                      ? ` · ${task.subtasks.filter((subtask) => subtask.completed).length}/${task.subtasks.length} 小任务`
                      : ""}
                  </small>
                  <div className="progress-track compact">
                    <span style={{ width: `${task.progress}%` }} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">还没有任务，添加一个行动目标吧。</p>
          )}
        </div>
        <div className="quick-actions">
          <h2>快捷操作</h2>
          <Link href="/learning">＋ 创建学习任务</Link>
          <Link href="/recommendation">✦ 查看职业推荐</Link>
          <Link href="/career-paths">◎ 探索职业方向</Link>
        </div>
      </section>
    </div>
  );
}
