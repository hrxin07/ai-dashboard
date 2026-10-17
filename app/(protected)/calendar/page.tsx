"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  progress: number;
  scheduleDate: string | null;
  deadline: string | null;
  description: string | null;
  subtasks: { id: string; title: string; completed: boolean; sortOrder: number }[];
};

type TaskForm = {
  title: string;
  type: string;
  priority: string;
  scheduleDate: string;
  deadline: string;
  description: string;
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
const weekdayLabels = ["日", "一", "二", "三", "四", "五", "六"];

function toDateKey(value: Date | string) {
  if (typeof value === "string") return value.slice(0, 10);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createEmptyForm(date: string): TaskForm {
  return {
    title: "",
    type: "COURSE",
    priority: "MEDIUM",
    scheduleDate: date,
    deadline: "",
    description: "",
  };
}

function formatLongDate(dateKey: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date(`${dateKey}T12:00:00`));
}

function monthTitle(month: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
  }).format(month);
}

export default function CalendarPage() {
  const today = toDateKey(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [form, setForm] = useState<TaskForm>(() => createEmptyForm(today));
  const [editing, setEditing] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

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

  const tasksByDate = useMemo(() => {
    const grouped = new Map<string, Task[]>();
    tasks.forEach((task) => {
      if (!task.scheduleDate) return;
      const dateKey = toDateKey(task.scheduleDate);
      grouped.set(dateKey, [...(grouped.get(dateKey) ?? []), task]);
    });
    return grouped;
  }, [tasks]);

  const selectedTasks = tasksByDate.get(selectedDate) ?? [];
  const completedCount = selectedTasks.filter((task) => task.status === "COMPLETED").length;
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(1 - firstDay.getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });

  const selectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setEditing(null);
    setForm(createEmptyForm(dateKey));
  };

  const resetEditor = (date = selectedDate) => {
    setEditing(null);
    setForm(createEmptyForm(date));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch(editing ? `/api/tasks/${editing}` : "/api/tasks", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setNotice(result.message);
    if (response.ok) {
      setSelectedDate(form.scheduleDate);
      resetEditor(form.scheduleDate);
      setCurrentMonth(() => {
        const date = new Date(`${form.scheduleDate}T12:00:00`);
        return new Date(date.getFullYear(), date.getMonth(), 1);
      });
      void load();
    }
  };

  const editTask = (task: Task) => {
    setEditing(task.id);
    setForm({
      title: task.title,
      type: task.type,
      priority: task.priority,
      scheduleDate: task.scheduleDate ? toDateKey(task.scheduleDate) : selectedDate,
      deadline: task.deadline ? toDateKey(task.deadline) : "",
      description: task.description ?? "",
    });
  };

  const toggleComplete = async (task: Task) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task.subtasks.length
        ? { subtasks: task.subtasks.map((subtask) => ({ ...subtask, completed: task.status !== "COMPLETED" })) }
        : { progress: task.status === "COMPLETED" ? 0 : 100 }),
    });
    const result = await response.json();
    if (!response.ok) setNotice(result.message);
    void load();
  };

  const removeTask = async (task: Task) => {
    if (!window.confirm(`确认删除“${task.title}”吗？`)) return;
    const response = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    const result = await response.json();
    setNotice(result.message);
    if (response.ok) {
      if (editing === task.id) resetEditor();
      void load();
    }
  };

  return (
    <div className="calendar-page">
      <header className="profile-page-head calendar-page-head">
        <div>
          <p className="profile-kicker">STUDY CALENDAR</p>
          <h1>学习日历</h1>
          <p>把学习任务安排到每天，按计划推进你的目标。</p>
        </div>
        <button
          type="button"
          className="calendar-today-button"
          onClick={() => {
            const date = new Date();
            setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
            selectDate(toDateKey(date));
          }}
        >
          回到今天
        </button>
      </header>

      <div className="calendar-layout">
        <section className="calendar-card" aria-label="学习任务日历">
          <div className="calendar-toolbar">
            <button
              type="button"
              aria-label="上个月"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            >
              ←
            </button>
            <h2>{monthTitle(currentMonth)}</h2>
            <button
              type="button"
              aria-label="下个月"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            >
              →
            </button>
          </div>
          <div className="calendar-weekdays">
            {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
          </div>
          <div className="calendar-grid">
            {days.map((day) => {
              const dateKey = toDateKey(day);
              const dayTasks = tasksByDate.get(dateKey) ?? [];
              const inMonth = day.getMonth() === currentMonth.getMonth();
              const isSelected = dateKey === selectedDate;
              return (
                <button
                  className={`calendar-day${inMonth ? "" : " muted"}${dateKey === today ? " today" : ""}${isSelected ? " selected" : ""}`}
                  type="button"
                  key={dateKey}
                  onClick={() => selectDate(dateKey)}
                  aria-pressed={isSelected}
                >
                  <span className="calendar-day-number">{day.getDate()}</span>
                  <span className="calendar-task-preview">
                    {dayTasks.slice(0, 2).map((task) => (
                      <span className={`calendar-task-dot ${task.status === "COMPLETED" ? "done" : ""}`} key={task.id} title={task.title}>
                        {task.title}
                      </span>
                    ))}
                    {dayTasks.length > 2 && <span className="calendar-more">+{dayTasks.length - 2}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="calendar-agenda">
          <section className="agenda-card">
            <div className="agenda-heading">
              <div><p>当日安排</p><h2>{formatLongDate(selectedDate)}</h2></div>
              <span>{completedCount}/{selectedTasks.length} 完成</span>
            </div>
            {loading ? <p className="calendar-empty">正在加载任务…</p> : selectedTasks.length === 0 ? (
              <p className="calendar-empty">这一天还没有学习安排，添加一个任务开始吧。</p>
            ) : (
              <div className="agenda-list">
                {selectedTasks.map((task) => (
                  <article className={`agenda-task ${task.status === "COMPLETED" ? "completed" : ""}`} key={task.id}>
                    <button className="agenda-check" type="button" onClick={() => void toggleComplete(task)} aria-label={task.status === "COMPLETED" ? "标记为未完成" : "标记为完成"}>
                      {task.status === "COMPLETED" ? "✓" : ""}
                    </button>
                    <button className="agenda-task-main" type="button" onClick={() => editTask(task)}>
                      <strong>{task.title}</strong>
                      <span>{types.find(([value]) => value === task.type)?.[1]} · {priorities.find(([value]) => value === task.priority)?.[1]}优先级 · {task.progress}%</span>
                    </button>
                    <button className="agenda-delete" type="button" onClick={() => void removeTask(task)} aria-label={`删除 ${task.title}`}>×</button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <form className="calendar-editor" onSubmit={submit}>
            <div className="calendar-editor-heading">
              <div><p>{editing ? "修改安排" : "新增安排"}</p><h2>{editing ? "编辑学习任务" : "为这一天安排任务"}</h2></div>
              {editing && <button type="button" onClick={() => resetEditor()}>取消编辑</button>}
            </div>
            <label>任务名称<input required value={form.title} placeholder="例如：完成 Transformer 笔记" onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
            <div className="calendar-form-grid">
              <label>安排日期<input required type="date" value={form.scheduleDate} onChange={(event) => setForm({ ...form, scheduleDate: event.target.value })} /></label>
              <label>截止日期<input type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} /></label>
              <label>任务类型<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>{types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label>优先级<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{priorities.map(([value, label]) => <option key={value} value={value}>{label}优先级</option>)}</select></label>
            </div>
            <label>备注（可选）<textarea rows={2} value={form.description} placeholder="写下今天的学习目标或产出" onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
            <button className="profile-save" type="submit">{editing ? "保存安排" : "添加到日历"}</button>
          </form>
          {notice && <p className="profile-notice success">{notice}</p>}
        </aside>
      </div>
    </div>
  );
}
