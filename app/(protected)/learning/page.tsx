"use client";

import { FormEvent, useEffect, useState } from "react";

type Subtask = {
  id?: string;
  title: string;
  completed: boolean;
  sortOrder?: number;
};
type Task = {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  progress: number;
  deadline: string | null;
  scheduleDate: string | null;
  description: string | null;
  subtasks: Subtask[];
};
type TaskForm = {
  title: string;
  type: string;
  priority: string;
  progress: number;
  deadline: string;
  scheduleDate: string;
  description: string;
  subtasks: Subtask[];
};

const types = [
  ["COURSE", "课程"],
  ["PROJECT", "项目"],
  ["COMPETITION", "竞赛"],
  ["JOB_PREP", "求职准备"],
  ["OTHER", "其他"],
];
const priorities = [
  ["HIGH", "高"],
  ["MEDIUM", "中"],
  ["LOW", "低"],
];
const emptyForm: TaskForm = {
  title: "",
  type: "COURSE",
  priority: "MEDIUM",
  progress: 0,
  deadline: "",
  scheduleDate: "",
  description: "",
  subtasks: [],
};

export default function LearningPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");

  const load = async () => {
    const response = await fetch("/api/tasks", { cache: "no-store" });
    const result = await response.json();
    if (response.ok) setTasks(result.data);
    else setNotice(result.message);
    setLoading(false);
  };

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, []);

  const resetEditor = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch(
      editing ? `/api/tasks/${editing}` : "/api/tasks",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    const result = await response.json();
    setNotice(result.message);
    if (response.ok) {
      resetEditor();
      void load();
    }
  };

  const edit = (task: Task) => {
    setEditing(task.id);
    setForm({
      title: task.title,
      type: task.type,
      priority: task.priority,
      progress: task.progress,
      deadline: task.deadline ? task.deadline.slice(0, 10) : "",
      scheduleDate: task.scheduleDate ? task.scheduleDate.slice(0, 10) : "",
      description: task.description || "",
      subtasks: task.subtasks.map((subtask) => ({ ...subtask })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: string) => {
    if (!window.confirm("确认删除这个学习任务吗？")) return;
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    const result = await response.json();
    setNotice(result.message);
    if (response.ok) void load();
  };

  const toggleSubtask = async (task: Task, index: number) => {
    const subtasks = task.subtasks.map((subtask, subtaskIndex) =>
      subtaskIndex === index
        ? { ...subtask, completed: !subtask.completed, sortOrder: subtaskIndex }
        : { ...subtask, sortOrder: subtaskIndex },
    );
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtasks }),
    });
    const result = await response.json();
    if (!response.ok) setNotice(result.message);
    void load();
  };
  const saveProgress = async (task: Task, completed: boolean) => {
    const body = task.subtasks.length
      ? {
          subtasks: task.subtasks.map((subtask, index) => ({
            ...subtask,
            completed,
            sortOrder: index,
          })),
        }
      : { progress: completed ? 100 : 0 };
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) setNotice(result.message);
    void load();
  };

  const updateSubtask = (index: number, patch: Partial<Subtask>) => {
    setForm((current) => ({
      ...current,
      subtasks: current.subtasks.map((subtask, subtaskIndex) =>
        subtaskIndex === index ? { ...subtask, ...patch } : subtask,
      ),
    }));
  };

  const visible = tasks.filter(
    (task) =>
      (filterStatus === "ALL" || task.status === filterStatus) &&
      (filterType === "ALL" || task.type === filterType) &&
      (filterPriority === "ALL" || task.priority === filterPriority),
  );

  return (
    <div className="learning-page">
      <header className="profile-page-head">
        <div>
          <p className="profile-kicker">LEARNING PRACTICE</p>
          <h1>学习实践</h1>
          <p>把职业目标转化为今天可以完成的行动。</p>
        </div>
      </header>
      <form className="task-editor" onSubmit={submit}>
        <h2>{editing ? "编辑任务" : "新增学习任务"}</h2>
        <input
          required
          placeholder="任务标题，例如：完成机器学习课程项目"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
        <div className="task-fields">
          <select
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
          >
            {types.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={form.priority}
            onChange={(event) =>
              setForm({ ...form, priority: event.target.value })
            }
          >
            {priorities.map(([value, label]) => (
              <option key={value} value={value}>
                {label}优先级
              </option>
            ))}
          </select>
          <input
            type="date"
            value={form.deadline}
            onChange={(event) =>
              setForm({ ...form, deadline: event.target.value })
            }
          />
        </div>
        <label className="learning-schedule-label">
          安排日期（可选，可在学习日历中查看）
          <input
            type="date"
            value={form.scheduleDate}
            onChange={(event) => setForm({ ...form, scheduleDate: event.target.value })}
          />
        </label>
        <textarea
          placeholder="补充任务说明（可选）"
          rows={3}
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
        />
        <div className="task-progress-editor">
          <label htmlFor="task-progress">
            完成进度{" "}
            <strong>
              {form.subtasks.length ? "由小任务自动计算" : `${form.progress}%`}
            </strong>
          </label>
          <input
            id="task-progress"
            type="range"
            min="0"
            max="100"
            step="1"
            disabled={form.subtasks.length > 0}
            value={form.progress}
            onChange={(event) =>
              setForm({ ...form, progress: Number(event.target.value) })
            }
          />
        </div>
        <div className="subtask-editor">
          <div className="subtask-heading">
            <div>
              <h3>小任务</h3>
              <p>完成小任务后，总进度会自动同步。</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  subtasks: [...form.subtasks, { title: "", completed: false }],
                })
              }
            >
              ＋ 添加小任务
            </button>
          </div>
          {form.subtasks.map((subtask, index) => (
            <div className="subtask-input" key={subtask.id ?? index}>
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={(event) =>
                  updateSubtask(index, { completed: event.target.checked })
                }
                aria-label="切换小任务完成状态"
              />
              <input
                required
                placeholder={`小任务 ${index + 1}`}
                value={subtask.title}
                onChange={(event) =>
                  updateSubtask(index, { title: event.target.value })
                }
              />
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    subtasks: form.subtasks.filter(
                      (_, subtaskIndex) => subtaskIndex !== index,
                    ),
                  })
                }
              >
                删除
              </button>
            </div>
          ))}
        </div>
        <div className="task-editor-actions">
          <button className="profile-save">
            {editing ? "保存修改" : "添加任务"}
          </button>
          {editing && (
            <button type="button" className="task-cancel" onClick={resetEditor}>
              取消
            </button>
          )}
        </div>
      </form>
      {notice && <p className="profile-notice success">{notice}</p>}
      <section className="task-list">
        <div className="task-list-head">
          <h2>
            我的任务 <small>{visible.length}</small>
          </h2>
          <button type="button" onClick={() => void load()}>
            刷新
          </button>
        </div>
        <div className="task-filters">
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
          >
            <option value="ALL">全部状态</option>
            <option value="TODO">待开始</option>
            <option value="IN_PROGRESS">进行中</option>
            <option value="COMPLETED">已完成</option>
          </select>
          <select
            value={filterType}
            onChange={(event) => setFilterType(event.target.value)}
          >
            <option value="ALL">全部类型</option>
            {types.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(event) => setFilterPriority(event.target.value)}
          >
            <option value="ALL">全部优先级</option>
            {priorities.map(([value, label]) => (
              <option key={value} value={value}>
                {label}优先级
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <p className="empty-state">正在加载任务…</p>
        ) : visible.length === 0 ? (
          <p className="empty-state">没有符合筛选条件的任务。</p>
        ) : (
          visible.map((task) => {
            const completedSubtasks = task.subtasks.filter(
              (subtask) => subtask.completed,
            ).length;
            return (
              <article
                className={`task-item ${task.status === "COMPLETED" ? "completed" : ""}`}
                key={task.id}
              >
                <button
                  className="task-check"
                  type="button"
                  onClick={() =>
                    void saveProgress(task, task.status !== "COMPLETED")
                  }
                  aria-label="切换完成状态"
                >
                  {task.status === "COMPLETED" ? "✓" : ""}
                </button>
                <div className="task-main">
                  <h3>{task.title}</h3>
                  <p>{task.description || "暂无任务说明"}</p>
                  <div className="progress-row">
                    <div
                      className="progress-track"
                      aria-label={`完成进度 ${task.progress}%`}
                    >
                      <span style={{ width: `${task.progress}%` }} />
                    </div>
                    <strong>{task.progress}%</strong>
                  </div>
                  {task.subtasks.length > 0 && (
                    <>
                      <p className="subtask-summary">
                        已完成 {completedSubtasks}/{task.subtasks.length}{" "}
                        个小任务
                      </p>
                      <div className="subtask-list">
                        {task.subtasks.map((subtask, index) => (
                          <label
                            className={
                              subtask.completed
                                ? "subtask-row completed"
                                : "subtask-row"
                            }
                            key={subtask.id ?? index}
                          >
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={() => void toggleSubtask(task, index)}
                            />
                            <span>{subtask.title}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="task-meta">
                    <span>
                      {types.find(([value]) => value === task.type)?.[1]}
                    </span>
                    <span>
                      {
                        priorities.find(
                          ([value]) => value === task.priority,
                        )?.[1]
                      }
                      优先级
                    </span>
                    {task.deadline && (
                      <span>截止 {task.deadline.slice(0, 10)}</span>
                    )}
                  </div>
                </div>
                <div className="task-actions">
                  <button type="button" onClick={() => edit(task)}>
                    编辑
                  </button>
                  <button type="button" onClick={() => void remove(task.id)}>
                    删除
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
