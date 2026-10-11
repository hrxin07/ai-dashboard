import Link from "next/link";

const features = [
  {
    number: "01",
    title: "职业方向探索",
    description:
      "聚焦算法、AIGC、数据分析等 AI 热门赛道，找到适合自己的成长坐标。",
  },
  {
    number: "02",
    title: "成长路径规划",
    description:
      "将职业目标拆解为清晰的阶段计划，让每一次学习都更接近理想岗位。",
  },
  {
    number: "03",
    title: "学习实践沉淀",
    description: "记录课程、项目与竞赛经历，直观看见能力积累和完成进度。",
  },
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function Sparkles() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path
        d="m12 2 1.35 5.15L18.5 8.5l-5.15 1.35L12 15l-1.35-5.15L5.5 8.5l5.15-1.35L12 2Zm6 12 .75 2.25L21 17l-2.25.75L18 20l-.75-2.25L15 17l2.25-.75L18 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="landing-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="site-nav" aria-label="主导航">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Sparkles />
          </span>
          <span>职业规划工作台</span>
        </Link>
        <div className="nav-links">
          <a href="#features">平台能力</a>
          <a href="#journey">成长路径</a>
          <a href="#about">关于平台</a>
        </div>
        <Link className="nav-login" href="/login">
          登录平台 <ArrowUpRight />
        </Link>
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> AI CAREER GROWTH PLATFORM
          </div>
          <h1 id="hero-title">
            让热爱 AI 的你
            <br />
            <i>走得更清晰</i>
          </h1>
          <p>
            人工智能专业的职业生涯规划学习实践工作台。
            <br className="desktop-only" />
            从目标探索到能力沉淀，陪你构建属于自己的成长路径。
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/register">
              开启我的规划 <ArrowUpRight />
            </Link>
            <a className="button button-ghost" href="#features">
              了解平台能力
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="职业成长数据示意">
          <div className="orbital-ring ring-large" />
          <div className="orbital-ring ring-small" />
          <div className="visual-glow" />
          <div className="path path-one" />
          <div className="path path-two" />
          <div className="node node-one">
            <span>Python</span>
          </div>
          <div className="node node-two">
            <span>Project</span>
          </div>
          <div className="node node-three">
            <span>ML</span>
          </div>
          <div className="career-core">
            <span className="core-mini">MY PATH</span>
            <strong>AI</strong>
            <span className="core-title">职业目标</span>
          </div>
          <div className="data-chip chip-top">
            <b>78%</b>
            <span>学习进度</span>
          </div>
          <div className="data-chip chip-bottom">
            <b>04</b>
            <span>实践项目</span>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="平台价值">
        <p>以目标为锚点，让学习和实践形成正向循环</p>
        <div className="trust-metrics">
          <span>
            <b>6+</b> AI 职业方向
          </span>
          <span>
            <b>3</b> 成长规划维度
          </span>
          <span>
            <b>∞</b> 你的未来可能
          </span>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <div>
            <span className="section-kicker">PLATFORM CAPABILITIES</span>
            <h2>
              从迷茫到笃定，
              <br />
              每一步都有方向
            </h2>
          </div>
          <p>用更有条理的方式，管理你的职业目标、学习任务和实践成果。</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <div className="feature-icon">
                <Sparkles />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="journey-section" id="journey">
        <div className="journey-card">
          <div className="journey-copy">
            <span className="section-kicker">START FROM TODAY</span>
            <h2>
              你的 AI 职业之路，
              <br />
              <i>从一次规划开始。</i>
            </h2>
            <p>建立个人档案，设定职业目标，完成每一个学习和实践任务。</p>
            <Link className="button button-light" href="/register">
              开始使用 <ArrowUpRight />
            </Link>
          </div>
          <div className="journey-art" aria-hidden="true">
            <div className="journey-line" />
            <span className="journey-step step-one">探索</span>
            <span className="journey-step step-two">规划</span>
            <span className="journey-step step-three">成长</span>
          </div>
        </div>
      </section>

      <footer id="about">
        <div className="brand">
          <span className="brand-mark">
            <Sparkles />
          </span>
          <span>职业规划工作台</span>
        </div>
        <p>人工智能专业的职业生涯规划学习实践工作台</p>
        <span>© 2026 人工智能职业生涯规划学习实践工作台</span>
      </footer>
    </main>
  );
}
