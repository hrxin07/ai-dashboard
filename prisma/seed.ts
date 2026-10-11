import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const paths = [
["算法工程师","负责机器学习算法设计、训练与优化。","Python、数学基础、机器学习、PyTorch","机器学习课程项目","推荐系统或分类模型","夯实数学与模型训练能力","算法,模型,训练"],
["机器学习工程师","将模型应用到真实业务并保障训练和部署流程。","Python、深度学习、MLOps、Docker","端到端模型服务","模型部署与监控","积累工程化实践","工程,部署,MLOps"],
["计算机视觉工程师","使用图像与视频理解技术解决视觉问题。","OpenCV、CNN、PyTorch、图像处理","目标检测项目","视觉算法研发","完成公开数据集项目","视觉,图像,深度学习"],
["数据分析师","从数据中发现规律并支持业务决策。","SQL、Python、统计学、可视化","校园数据分析报告","指标体系与洞察","强化业务表达能力","数据,分析,SQL"],
["AIGC 应用开发工程师","构建基于大模型的智能应用与工作流。","Python、LLM、Prompt、RAG、Web","智能问答应用","大模型应用落地","练习评测与工程集成","AIGC,大模型,RAG"],
["AI 产品经理","把用户需求转化为可落地的人工智能产品。","需求分析、数据思维、AI基础、原型设计","AI产品原型与调研","产品规划与协作","提升场景理解能力","产品,需求,AI"],
];
async function main(){for(const p of paths){await db.careerPath.upsert({where:{name:p[0]},update:{description:p[1],skills:p[2],courses:p[3],projects:p[4],prospect:p[5],tags:p[6]},create:{name:p[0],description:p[1],skills:p[2],courses:p[3],projects:p[4],prospect:p[5],tags:p[6]}})}}main().finally(()=>db.$disconnect());
