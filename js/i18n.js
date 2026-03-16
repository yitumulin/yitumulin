(function() {
  "use strict";

  const LANG_STORAGE_KEY = "site_lang";
  const MANUAL_OVERRIDE_KEY = "site_lang_manual";
  const AUTO_LANG_CACHE_KEY = "site_lang_auto";
  const AUTO_LANG_CACHE_TIME_KEY = "site_lang_auto_time";
  const AUTO_LANG_CACHE_TTL = 1000 * 60 * 60 * 24 * 3;

  let currentLanguage = "en";

  const TITLE_BY_PAGE = {
    "index.html": { en: "一土木林 yitumulin | AI Portfolio", zh: "一土木林 yitumulin | AI作品集" },
    "about.html": { en: "Resume | 一土木林 yitumulin", zh: "简历 | 一土木林 yitumulin" },
    "posts.html": { en: "Projects | 一土木林 yitumulin", zh: "项目 | 一土木林 yitumulin" },
    "contact.html": { en: "Contact | 一土木林 yitumulin", zh: "联系 | 一土木林 yitumulin" },
    "archives.html": { en: "Archives - yitumulin", zh: "归档 - yitumulin" },
    "search.html": { en: "Search - yitumulin", zh: "搜索 - yitumulin" },
    "404.html": { en: "Page Not Found (404) - yitumulin", zh: "页面未找到 (404) - yitumulin" },
    "tag-view.html": { en: "Tag View - yitumulin", zh: "标签视图 - yitumulin" },
    "wudangdao.html": { en: "Listening | 一土木林 yitumulin", zh: "听书 | 一土木林 yitumulin" },
    "posts/project1.html": { en: "Project: AI & Aging Research - yitumulin", zh: "项目：AI 与老龄化研究 - yitumulin" }
  };

  const EN_TO_ZH = {
    "Home": "首页",
    "About": "简历",
    "Posts": "项目",
    "Projects": "项目",
    "Portfolio": "作品集",
    "Resume": "简历",
    "Contact": "联系",
    "Listening": "听书",
    "Archives": "归档",
    "Search": "搜索",
    "AI Portfolio / Internship Profile": "AI 作品集 / 实习档案",
    "I build AI products end-to-end, from research ideas to production-ready systems.": "我做端到端 AI 产品，从研究想法到可上线系统。",
    "I am a Telecommunication Engineering and Management student at Beijing University of Posts and Telecommunications. This portfolio is designed for recruiters to quickly evaluate my projects, responsibilities, and technical impact.": "我在北京邮电大学学习电信工程与管理。这个作品集面向招聘方，帮助你快速了解我的项目、职责和技术产出。",
    "I am passionate about software development and AI. Through hands-on practice, I have built strong programming and problem-solving skills, with deep focus on code quality, full-stack implementation, and system design.": "我长期专注软件开发与 AI。通过大量实战，我建立了扎实的编程与问题解决能力，并持续关注代码质量、全栈实现与系统设计。",
    "About Me": "我的简历",
    "View Portfolio": "查看项目",
    "View Resume": "查看简历",
    "View Projects": "查看项目",
    "Email": "邮箱",
    "Resume Snapshot": "简历概览",
    "Core Expertise and Profile": "核心能力与职业画像",
    "School": "学校",
    "Beijing University of Posts and Telecommunications": "北京邮电大学",
    "Role Focus": "岗位方向",
    "Portfolio Goal": "作品目标",
    "Projects, roles, and measurable outcomes": "项目、职责与可量化成果",
    "Core Expertise": "核心能力",
    "Work preference: open to AI product engineering and software development internships.": "工作偏好：AI 产品工程与软件开发相关实习。",
    "Professional Profile": "职业画像",
    "What I Bring to a Team": "我能为团队带来什么",
    "Selected Projects": "代表项目",
    "Roles and Strengths": "角色与优势",
    "Highlights": "亮点",
    "Profile": "简介",
    "Recruiter-focused summary of my background, technical strengths, and collaboration value.": "面向招聘方的背景、技术优势与协作价值概览。",
    "Open About": "查看简历",
    "Open Resume": "查看简历",
    "Portfolio": "作品集",
    "Project pages that show scope, my role, implementation details, and outcomes.": "项目页面会展示范围、我的职责、实现细节与结果。",
    "Open Posts": "查看项目",
    "Open Projects": "查看项目",
    "Productized listening page with searchable episodes and resume playback support.": "产品化听书页面，支持分集搜索与续播。",
    "Software Development": "软件开发",
    "Full-Stack Understanding": "全栈理解",
    "System Thinking": "系统思维",
    "Publications with DOI": "带 DOI 的论文成果",
    "Software Copyright Portfolio": "软件著作权成果",
    "Growth Mindset": "成长型思维",
    ": problem framing, model strategy, and system-level planning.": "：问题定义、模型策略与系统规划。",
    ": real-time interaction and front-end implementation.": "：实时交互与前端实现。",
    ": searchable content, playback memory, and practical UX decisions.": "：可搜索内容、续播记忆与实用体验设计。",
    ": solid coding practice and disciplined engineering execution.": "：扎实编码习惯与工程执行能力。",
    ": connects product logic, implementation details, and delivery quality.": "：能够连接产品逻辑、实现细节和交付质量。",
    ": values maintainability, scalability, and clear architecture.": "：重视可维护性、可扩展性与清晰架构。",
    ": peer-reviewed outputs linked directly for recruiter verification.": "：可直接核验的同行评审成果。",
    ": selected software achievements in AI and intelligent systems.": "：AI 与智能系统相关的软件成果。",
    ": fast adaptation to new technologies and strong team contribution focus.": "：快速适应新技术并重视团队贡献。",
    "I position my portfolio to show how I create practical AI and software value.": "这个作品集重点展示我如何创造可落地的 AI 与软件价值。",
    "This page is written for recruiters and hiring managers. It summarizes my technical scope, project roles, and execution style so teams can quickly understand how I can contribute in internship and early-career engineering roles.": "本页面面向招聘方与用人团队，概括我的技术范围、项目角色与执行风格，帮助快速判断我在实习和初级工程岗位中的贡献方式。",
    "What This Portfolio Demonstrates": "这个作品集展示什么",
    "I am deeply interested in software development, large language models, and applied AI systems. In project practice, I focus on turning concepts into usable products with reliable engineering decisions.": "我长期关注软件开发、LLM 与应用型 AI 系统。在项目实践中，我强调把概念变成可用产品，并通过可靠的工程决策确保落地。",
    "I have built strong programming fundamentals and problem-solving ability through implementation-heavy work. I pay close attention to code quality, maintainability, and system design, and I adapt quickly in collaborative environments.": "通过高实现密度的项目，我形成了扎实的编程基础与问题解决能力。我注重代码质量、可维护性和系统设计，也能快速适应协作环境。",
    "Engineering Direction": "工程方向",
    ": AI product development with strong software discipline.": "：以软件工程纪律推进 AI 产品开发。",
    "Execution Style": "执行风格",
    ": clear scope, measurable progress, and practical delivery.": "：范围清晰、进展可量化、交付务实。",
    "Long-Term Goal": "长期目标",
    ": grow on the LLM/AI track and build products with real-world value.": "：在 LLM/AI 方向持续成长，做有真实价值的产品。",
    "Professional Summary": "职业概览",
    "Education": "教育背景",
    "BUPT International School · Telecommunication Engineering and Management": "北京邮电大学国际学院 · 电信工程与管理",
    "Specialized Areas": "专长方向",
    "Engineering Strength": "工程优势",
    "Full-stack understanding, code quality, and system-level reasoning": "全栈理解、代码质量意识与系统级思考",
    "Research": "研究",
    "Papers and Research Output": "论文与研究成果",
    "Published in Scientific Data: long-term cattle recognition dataset and baseline verification.": "发表于 Scientific Data：长期牛只识别数据集及基线验证。",
    "Published in Computers and Electronics in Agriculture: top-view rotated object detection and lightweight modeling.": "发表于 Computers and Electronics in Agriculture：顶视角旋转目标检测与轻量化建模。",
    "Under review: semantic entropy and character diversity modeling for narrative complexity.": "在审：叙事复杂度中的语义熵与角色多样性建模。",
    "Target field: Computational Literary Studies": "目标领域：计算文学研究",
    "Software Achievements": "软件成果",
    "AI Application Systems": "AI 应用系统",
    "Engineering-Oriented Tools": "工程导向工具",
    "Verification Ready": "可验证",
    "Registered software achievements covering intelligent analysis and AI-assisted workflows.": "已登记的软件成果覆盖智能分析与 AI 辅助流程。",
    "Software works focused on practical problem solving, implementation quality, and deployment readiness.": "软件作品聚焦实际问题解决、实现质量与部署可用性。",
    "Detailed software copyright titles and registration numbers can be provided during formal recruitment communication.": "在正式招聘沟通中可提供详细著作权名称与登记号。",
    "Projects": "项目",
    "Technical Projects and Research Notes": "技术项目与研究笔记",
    "This page is where I keep publishing LLM, CV, and engineering work. Each entry aims to include goals, methods, implementation, and outcomes.": "这里持续发布 LLM、CV 与工程实践内容。每篇内容都尽量覆盖目标、方法、实现与结果。",
    "Project: AI & Aging Research": "项目：AI 与老龄化研究",
    "2025-05-10 · Research project": "2025-05-10 · 研究项目",
    "2025-07-xx · Computational text analysis": "2025-07-xx · 计算文本分析",
    "2025-xx-xx · Technical breakdown": "2025-xx-xx · 技术拆解",
    "Roadmap": "路线图",
    "Upcoming LLM Content": "即将更新的 LLM 内容",
    "Reusable templates from data prep to retrieval strategy and answer evaluation.": "从数据准备到检索策略与答案评估的可复用模板。",
    "Task decomposition, tool calling, state handling, and fallback patterns.": "任务拆解、工具调用、状态管理与兜底模式。",
    "Latency, cost control, observability, and production stability improvements.": "延迟、成本、可观测性与生产稳定性的优化实践。",
    "Let’s Work Together": "期待合作",
    "Let's Work Together": "期待合作",
    "If you want to discuss LLM projects, engineering collaboration, or research ideas, reach me here.": "如果你想交流 LLM 项目、工程协作或研究想法，可以通过这里联系我。",
    "Notes": "说明",
    "For faster replies, include your goal, use case, expected deliverables, and timeline.": "为了更快回复，建议附上目标、使用场景、预期交付和时间安排。",
    "Archive": "归档",
    "Release Timeline": "发布时间线",
    "A chronological view of published projects and major site updates.": "按时间查看已发布项目与站点重要更新。",
    "Site refresh, LLM showcase roadmap, and listening page updates.": "站点改版、LLM 展示路线与听书页面更新。",
    "Research outputs, narrative analysis pages, and technical notes.": "研究成果、叙事分析页面与技术笔记。",
    "Foundation engineering projects and system practice.": "基础工程项目与系统实践。",
    "Find Any Page Quickly": "快速查找页面",
    "Search by project name, topic, or page title.": "可按项目名、主题或页面标题搜索。",
    "Page Not Found": "页面未找到",
    "The page you are looking for does not exist or may have been moved.": "你访问的页面不存在，或已被移动。",
    "Back Home": "返回首页",
    "Search the Site": "站内搜索",
    "Tag View": "标签视图",
    "Wudangdao": "吾当道",
    "Choose an episode to start": "请选择一集开始播放",
    "Total 0 episodes": "共 0 集",
    "Previous Episode": "上一集",
    "Next Episode": "下一集",
    "Quick Guide": "使用说明",
    "Resume Playback": "续播",
    "Auto-Play": "连播",
    "Search: Enter keywords to quickly locate episodes.": "搜索：输入关键词快速定位分集。",
    "Resume: Automatically remembers your last playback position.": "续播：自动记录上次播放位置。",
    "Auto-Play: Moves to the next episode when the current one finishes.": "连播：当前集播放结束后自动进入下一集。",
    ": Enter keywords to quickly locate episodes.": "：输入关键词快速定位分集。",
    ": Automatically remembers your last playback position.": "：自动记录上次播放位置。",
    ": Moves to the next episode when the current one finishes.": "：当前集播放结束后自动进入下一集。",
    "Search episodes": "搜索分集",
    "Loading audio list...": "正在加载音频列表...",
    "Previous": "上一页",
    "Page 1 / 1": "第 1 页 / 共 1 页",
    "Next": "下一页",
    "Your browser does not support audio playback.": "当前浏览器不支持音频播放。",
    "Table of Contents": "目录",
    "Introduction": "引言",
    "As global aging accelerates, pressure on medical resources, chronic disease management, and caregiving costs keeps rising. This project focuses on how AI can create practical value in aging-related scenarios, and breaks the problem into actionable data, modeling, and product tasks.": "随着全球老龄化加速，医疗资源紧张、慢病管理复杂、照护成本上升等问题越来越突出。这个项目聚焦“AI 如何在老龄化场景里创造实际价值”，目标是把研究问题拆解成可落地的数据任务、模型任务和产品任务。",
    "Research Background": "研究背景",
    "Aging scenarios have clear data and business characteristics: diverse data sources, high labeling costs, large individual differences, and strong long-term tracking needs. Compared with single-model optimization, building a stable data loop and interpretable decision flow matters more.": "老龄化相关场景具有明显的数据和业务特征：数据来源多样、标注成本高、个体差异大、长期追踪需求强。相比单点模型优化，更重要的是建立稳定的数据闭环和可解释的决策流程。",
    "Current Challenges": "当前挑战",
    "Uneven data distribution and inconsistent standards across institutions.": "数据分布不均，机构间数据标准不统一。",
    "Model performance degradation in real-world environments.": "模型在真实场景中容易出现性能衰减。",
    "Business teams care more about risk control and interpretability than offline metrics alone.": "业务侧更关注风险控制和解释性，而不只是离线指标。",
    "AI Solution Directions": "AI 解决方案方向",
    "The project designs solutions from three layers: risk prediction, intelligent monitoring, and workflow collaboration, emphasizing end-to-end delivery instead of stopping at paper-level experiments.": "项目从“风险预测 + 智能监测 + 工作流协同”三个层面设计方案，强调端到端交付，而不是只停留在论文级别实验。",
    "Risk Prediction Models": "风险预测模型",
    "Health risk stratification with multi-source features for early warning.": "基于多源特征做健康风险分层，支持早期预警。",
    "Time-series and structured-feature fusion for better stability.": "使用时间序列与结构化特征融合，提升稳定性。",
    "Explainable outputs to support faster clinical and care decisions.": "引入可解释输出，帮助医生和照护人员快速判断。",
    "Intelligent Monitoring Systems": "智能监测系统",
    "Detect abnormal behavior and status changes with vision or sensors.": "结合视觉或传感器数据识别异常行为与状态变化。",
    "Event-level alerts and playback to reduce missed or false reports.": "支持事件级告警与回放，减少漏报和误报成本。",
    "Workflow integration so system suggestions are executable and traceable.": "与人工流程衔接，确保系统建议可执行、可追踪。",
    "Future Outlook": "未来展望",
    "The next focus is not one-time model refreshes, but sustainable iteration: data feedback, model updates, rule collaboration, and outcome evaluation. Only a long-term loop makes AI stable and valuable in aging care scenarios.": "后续重点不是“单次模型刷新”，而是持续迭代机制：数据反馈、模型更新、规则协同、效果评估。只有形成长期闭环，AI 才能在健康养老场景里稳定创造价值。",
    "Next Steps": "下一步计划",
    "Improve evaluation from model metrics to business metrics.": "完善评估体系：从模型指标扩展到业务指标。",
    "Add real-scene tests to verify cross-scenario generalization.": "补充真实场景测试，验证跨场景泛化能力。",
    "Promote lightweight deployment to reduce integration and maintenance costs.": "推动轻量化部署，降低系统接入和维护成本。",
    "Work preference: open to AI product engineering and software development roles.": "工作偏好：AI 产品工程与软件开发岗位。",
    "Project Evidence": "项目证据",
    "Weclone": "Weclone",
    "Shapeville Geometry Education (GitHub)": "Shapeville 几何教育应用（GitHub）",
    "Shapeville Geometry Education": "Shapeville 几何教育应用",
    "MiniMind Full-Pipeline Reproduction (GitHub)": "MiniMind 全流程复现（GitHub）",
    "MiniMind Full-Pipeline Reproduction": "MiniMind 全流程复现",
    "WeClone End-to-End Deployment (GitHub)": "WeClone 端到端部署（GitHub）",
    "WeClone End-to-End Deployment": "WeClone 端到端部署",
    ": built a Java/Swing geometry learning application with staged tasks, scoring feedback, and progress tracking.": "：完成 Java/Swing 几何学习应用开发，含分阶段任务、评分反馈与进度追踪。",
    ": completed single-GPU full workflow runs across pretraining, SFT, LoRA, and evaluation with checkpoint resume.": "：在单卡环境完成预训练、SFT、LoRA、评估全流程运行，并验证断点续训。",
    ": completed local setup, data preparation, fine-tuning configuration, API service startup, and chatbot integration validation.": "：完成本地环境搭建、数据准备、微调配置、API 服务启动与聊天平台联调验证。",
    "Weclone (Local Deployment)": "Weclone（本地部署）",
    ": independently completed full local deployment, service orchestration, runtime debugging, and end-to-end verification.": "：独立完成本地部署、服务编排、运行调试与端到端验证。",
    ": EEG signal processing and BCI interaction pipeline implementation.": "：脑电信号处理与 BCI 交互流程实现。",
    ": speech-to-email workflow integration for practical AI productivity use.": "：语音到邮件工作流集成，面向实用 AI 生产力场景。",
    ": 2,000+ likes on Douyin with structured end-to-end teaching output.": "：抖音 2000+ 点赞，形成结构化端到端教学产出。",
    "Project Execution Evidence": "项目执行证据",
    ": independently ran Weclone local deployment end-to-end, including setup, orchestration, debugging, and final validation.": "：独立完成 Weclone 本地部署全流程，包括环境搭建、服务编排、调试与最终验证。",
    ": independently completed multi-project engineering runs across Shapeville implementation, MiniMind full pipeline reproduction, and WeClone end-to-end deployment validation.": "：独立完成多项目工程化落地，包括 Shapeville 开发、MiniMind 全流程复现与 WeClone 端到端部署验证。",
    "Database Engineering": "数据库工程",
    ": can design and organize structured content for searchable product experiences.": "：可设计并组织结构化内容，支持可搜索的产品体验。",
    ": two software copyright projects with clear algorithm modules.": "：两项软著项目，算法模块明确可说明。",
    ": this website is built as a recruiter-facing AI engineer portfolio, not a blog.": "：这个网站面向招聘场景，是 AI 工程师展示站而非博客。",
    "Resume - yitumulin": "简历 - yitumulin",
    "Projects - yitumulin": "项目 - yitumulin",
    "Project Evidence for AI Engineering Roles": "面向 AI 工程岗位的项目证据",
    "This page focuses on practical engineering output instead of blog-style drafts. It highlights what I built, what I implemented, and where the work can be verified.": "这个页面聚焦工程产出，不再使用博客式草稿结构，重点展示我做了什么、实现了什么、以及可验证的证据链接。",
    "2025 · BCI signal processing and interaction prototype": "2025 · BCI 信号处理与交互原型",
    "Built EEG-oriented signal and interaction pipeline for practical BCI experiments.": "构建面向脑电的信号与交互流程，用于实际 BCI 实验。",
    "2025 · LLM + speech workflow product demo": "2025 · LLM + 语音工作流产品演示",
    "Integrated speech recognition and email task flow into a usable productivity prototype.": "将语音识别与邮件任务流程整合为可用的效率工具原型。",
    "Java / Swing · Geometry learning product implementation": "Java / Swing · 几何学习产品实现",
    "PyTorch / LLM · End-to-end training and inference workflow": "PyTorch / LLM · 端到端训练与推理流程",
    "LLM Agent / Service integration · Local deployment and validation": "LLM Agent / 服务集成 · 本地部署与验证",
    "BCI / Signal Processing · EEG interaction prototype": "BCI / 信号处理 · EEG 交互原型",
    "LLM + Speech · Productivity workflow prototype": "LLM + 语音 · 效率工作流原型",
    "What I delivered:": "我完成了：",
    "Tech stack:": "技术栈：",
    "Measurable output:": "可量化产出：",
    "implemented a complete desktop geometry learning app with seven staged modules (2D, 3D, angle, circle, composite shape, sector, stage challenge).": "实现完整桌面几何学习应用，覆盖 7 个阶段模块（2D、3D、角度、圆、组合图形、扇形、关卡挑战）。",
    "Java, Swing, object-oriented architecture, modular UI panels, and Javadoc-based maintainability setup.": "Java、Swing、面向对象架构、模块化 UI 面板与基于 Javadoc 的可维护性体系。",
    "built 7 runnable learning modules, unified score feedback flow, and persistent progress display for productized learning interaction.": "完成 7 个可运行学习模块、统一评分反馈流程和可持续进度展示，形成产品化学习交互。",
    "independently executed the full MiniMind pipeline from pretraining to SFT, LoRA fine-tuning, and evaluation/inference.": "独立跑通 MiniMind 全流程：从预训练到 SFT、LoRA 微调，再到评估与推理。",
    "Python, PyTorch, distributed/multi-stage training scripts, checkpoint resume, and inference deployment scripts.": "Python、PyTorch、分布式/多阶段训练脚本、断点续训与推理部署脚本。",
    "completed 4 core pipeline stages (Pretrain, SFT, LoRA, Eval) with reproducible local runs and validated checkpoint continuation workflow.": "完成 4 个核心阶段（Pretrain、SFT、LoRA、Eval）可复现本地运行，并验证断点续训流程。",
    "completed local environment setup, training data preparation, model tuning configuration, API service startup, and chatbot platform connection.": "完成本地环境搭建、训练数据准备、模型调参配置、API 服务启动与聊天平台连接。",
    "Python ecosystem, model service APIs, retrieval/chat orchestration, and deployment scripts.": "Python 生态、模型服务 API、检索/对话编排与部署脚本。",
    "ran full deployment chain from data to service response, completed end-to-end verification, and published deployment evidence video.": "跑通从数据到服务响应的完整部署链路，完成端到端验证并发布部署证据视频。",
    "Deployment evidence (Douyin)": "部署证据（抖音）",
    "Weclone Local Deployment (Douyin Demo)": "Weclone 本地部署（抖音演示）",
    "2025 · End-to-end local deployment and system validation": "2025 · 本地全流程部署与系统验证",
    "Independently completed environment setup, dependency alignment, service startup, WeChat clone workflow run-through, issue diagnosis, and final delivery demo.": "独立完成环境搭建、依赖对齐、服务启动、微信克隆流程跑通、问题定位与最终演示交付。",
    "2025-05-10 · Research-to-product problem framing": "2025-05-10 · 从研究到产品的问题建模",
    "A structured engineering note from scenario analysis to deployable AI solution directions.": "从场景分析到可部署 AI 方案方向的结构化工程记录。",
    "2026 · Productized personal showcase": "2026 · 产品化个人展示站",
    "Designed as a recruiter-facing AI engineer portfolio with bilingual UX and searchable content.": "按招聘导向设计的 AI 工程师作品集，支持中英文与可搜索内容。",
    "2025 · 2,000+ likes on Douyin": "2025 · 抖音 2000+ 点赞",
    "Created a full tutorial sequence with clear structure, practical examples, and delivery consistency.": "完成成体系教程内容，结构清晰、案例实用、交付稳定。",
    "Research And Resume": "研究与简历",
    "How I Place Papers and Achievements": "论文与成果的展示方式",
    "Resume (Detailed)": "简历页（详细）",
    "Full publication details and software copyright records are kept in the Resume page for recruiter review.": "论文细节与软著明细放在简历页，方便招聘方集中审核。",
    "Projects (Evidence)": "项目页（证据）",
    "This page keeps concise proof links, implementation outcomes, and product-level engineering evidence.": "项目页保留精简证据链接、实现结果与产品级工程证明。",
    "Decision": "展示策略",
    "Papers are shown in both places: detailed in Resume, concise proof in Projects for fast screening.": "论文两处都放：简历页给详细信息，项目页给精简证据，便于快速筛选。",
    "Beijing University of Posts and Telecommunications · Telecommunication Engineering and Management": "北京邮电大学 · 电信工程与管理",
    "Non-contact Beef Cattle Body Growth Tracking System Based on Machine Vision": "基于机器视觉的无接触肉牛体型生长跟踪系统",
    "2025.06 · Implemented top-view cattle body detection and growth tracking algorithm modules.": "2025.06 · 实现顶视角牛体检测与生长跟踪算法模块。",
    "EEG Hidden-frequency System Based on Microtexture and Closed-loop Control": "基于微纹理与闭环控制的脑电隐频系统",
    "2025.10 · Implemented EEG microtexture feature extraction and closed-loop control algorithm modules.": "2025.10 · 实现脑电信号微纹理特征提取与闭环控制算法模块。",
    "Software copyright titles are aligned with my resume and available for verification during recruitment communication.": "软著名称已与简历一致，可在招聘沟通中提供核验。",
    "Published in Scientific Data (2025): long-term cattle recognition dataset and baseline verification framework.": "发表于 Scientific Data（2025）：长期牛只识别数据集与基线验证框架。",
    "My contribution": "我的工作",
    ": participated in full data pipeline design, detection/pose/ReID evaluation protocol construction, and baseline modeling experiments.": "：参与完整数据流程设计、检测/姿态/ReID 评测协议构建与基线建模实验。",
    "participated in full data pipeline design, detection/pose/ReID evaluation protocol construction, and baseline modeling experiments.": "参与完整数据流程设计、检测/姿态/ReID 评测协议构建与基线建模实验。",
    "Measurable output": "可量化成果",
    ": co-built dataset subsets reported in the paper: 16,889 images covering 5,661 cattle and 12,172 labeled images for long-term tracking of 103 cattle.": "：参与构建论文报告的数据子集：16,889 张图像覆盖 5,661 头牛，以及 12,172 张标注图像用于 103 头牛长期追踪。",
    "co-built dataset subsets reported in the paper: 16,889 images covering 5,661 cattle and 12,172 labeled images for long-term tracking of 103 cattle.": "参与构建论文报告的数据子集：16,889 张图像覆盖 5,661 头牛，以及 12,172 张标注图像用于 103 头牛长期追踪。",
    "Engineering value": "工程价值",
    ": established reusable evaluation workflow for long-cycle recognition tasks, including cross-dataset validation settings.": "：建立可复用的长周期识别评估流程，包含跨数据集验证设置。",
    "established reusable evaluation workflow for long-cycle recognition tasks, including cross-dataset validation settings.": "建立可复用的长周期识别评估流程，包含跨数据集验证设置。",
    "Published in Computers and Electronics in Agriculture (2025): contactless top-view rotated cattle detection framework.": "发表于 Computers and Electronics in Agriculture（2025）：无接触顶视角牛体旋转检测框架。",
    ": built top-view cattle data processing and rotated object detection workflow, and implemented lightweight vision modeling modules.": "：构建顶视角牛体数据处理与旋转目标检测流程，并实现轻量化视觉建模模块。",
    "built top-view cattle data processing and rotated object detection workflow, and implemented lightweight vision modeling modules.": "构建顶视角牛体数据处理与旋转目标检测流程，并实现轻量化视觉建模模块。",
    ": paper-reported system-level results include about 70% parameter reduction and about 50% FLOPs reduction with at least 3% AP gain versus compared bottom-up approaches.": "：论文报告的系统级结果显示：参数量约降低 70%、FLOPs 约降低 50%，并相对对比的 bottom-up 方法实现至少 3% AP 提升。",
    "paper-reported system-level results include about 70% parameter reduction and about 50% FLOPs reduction with at least 3% AP gain versus compared bottom-up approaches.": "论文报告的系统级结果显示：参数量约降低 70%、FLOPs 约降低 50%，并相对对比的 bottom-up 方法实现至少 3% AP 提升。",
    ": completed cascaded pipeline of detection, keypoint localization, and alignment for robust top-view scenarios.": "：完成检测、关键点定位与对齐的级联流程，增强顶视角场景鲁棒性。",
    "completed cascaded pipeline of detection, keypoint localization, and alignment for robust top-view scenarios.": "完成检测、关键点定位与对齐的级联流程，增强顶视角场景鲁棒性。",
    "Under review (2026): semantic-entropy-based computational analysis of narrative complexity in Xianxiao texts.": "在审（2026）：基于语义熵的仙侠文本叙事复杂度计算分析。",
    ": designed semantic entropy modeling strategy, narrative complexity indicators, and full statistical evaluation process.": "：设计语义熵建模策略、叙事复杂度指标与完整统计评估流程。",
    "designed semantic entropy modeling strategy, narrative complexity indicators, and full statistical evaluation process.": "设计语义熵建模策略、叙事复杂度指标与完整统计评估流程。",
    ": completed an end-to-end 4-stage pipeline (text preprocessing, feature extraction, entropy modeling, statistical testing) and full manuscript writing.": "：完成端到端 4 阶段流程（文本预处理、特征提取、熵建模、统计检验）以及全文写作。",
    "completed an end-to-end 4-stage pipeline (text preprocessing, feature extraction, entropy modeling, statistical testing) and full manuscript writing.": "完成端到端 4 阶段流程（文本预处理、特征提取、熵建模、统计检验）以及全文写作。",
    ": translated literary analysis problems into reproducible computational workflow for research-scale iteration.": "：将文学分析问题转化为可复现的计算流程，支持研究级迭代。",
    "translated literary analysis problems into reproducible computational workflow for research-scale iteration.": "将文学分析问题转化为可复现的计算流程，支持研究级迭代。",
    "Target journal: Journal of Computational Literary Studies": "目标期刊：Journal of Computational Literary Studies",
    "2025.06 · Machine vision software copyright project": "2025.06 · 机器视觉软著项目",
    ": implemented top-view cattle detection and growth tracking algorithm modules with complete inference workflow.": "：实现顶视角牛体检测与生长跟踪算法模块，并完成完整推理流程。",
    "implemented top-view cattle detection and growth tracking algorithm modules with complete inference workflow.": "实现顶视角牛体检测与生长跟踪算法模块，并完成完整推理流程。",
    "Optimization focus": "优化重点",
    ": improved detection-to-tracking handoff stability and structured long-cycle growth monitoring logic.": "：优化检测到跟踪的衔接稳定性，并结构化长周期生长监测逻辑。",
    "improved detection-to-tracking handoff stability and structured long-cycle growth monitoring logic.": "优化检测到跟踪的衔接稳定性，并结构化长周期生长监测逻辑。",
    "Deliverables": "交付成果",
    ": production-oriented algorithm module package and verifiable technical documentation for recruitment review.": "：形成面向工程交付的算法模块包与可核验技术文档。",
    "production-oriented algorithm module package and verifiable technical documentation for recruitment review.": "形成面向工程交付的算法模块包与可核验技术文档。",
    "2025.10 · EEG software copyright project": "2025.10 · 脑电软著项目",
    ": implemented EEG microtexture feature extraction and closed-loop control algorithm modules.": "：实现脑电微纹理特征提取与闭环控制算法模块。",
    ": tuned preprocessing and feature-flow stability for repeated closed-loop triggering experiments.": "：针对重复闭环触发实验优化预处理与特征流稳定性。",
    "tuned preprocessing and feature-flow stability for repeated closed-loop triggering experiments.": "针对重复闭环触发实验优化预处理与特征流稳定性。",
    ": reusable algorithm implementation and validation scripts for iterative BCI experimentation.": "：形成可复用算法实现与验证脚本，支持 BCI 迭代实验。",
    "reusable algorithm implementation and validation scripts for iterative BCI experimentation.": "形成可复用算法实现与验证脚本，支持 BCI 迭代实验。",
    "AI / LLM Application Engineer in Training": "AI / LLM 应用工程师（成长中）",
    "LLM Application, AI Development, AI Product Engineering": "LLM 应用工程、AI 开发、AI 产品工程",
    "I am a Telecommunication Engineering and Management student at Beijing University of Posts and Telecommunications, currently building in LLM application engineering, AI development, and AI product engineering.": "我在北京邮电大学学习电信工程与管理，目前在 LLM 应用工程、AI 开发和 AI 产品工程方向持续开发与实践。",
    "This portfolio shows what I built, what I owned, and what measurable outcomes I delivered.": "这个作品集向你展示我做了什么、负责了什么，以及有哪些可量化结果。",
    "5 End-to-End AI Projects": "5 个端到端 AI 项目",
    "2 Published Papers + 1 Under Review": "2 篇已发表论文 + 1 篇在审",
    "2 Software Copyrights": "2 项软件著作权",
    "Core Stack:": "核心技术栈：",
    "Featured Project Snapshots": "代表项目速览",
    "MiniMind: completed Pretrain, SFT, LoRA, and Eval full-pipeline reproduction.": "MiniMind：完成 Pretrain、SFT、LoRA、Eval 全流程复现。",
    "WeClone: completed local deployment chain from data preparation to service validation.": "WeClone：完成从数据准备到服务验证的本地部署链路。",
    "Shapeville: built a runnable Java/Swing geometry product with 7 staged modules.": "Shapeville：构建可运行的 Java/Swing 几何产品，含 7 个分阶段模块。",
    "Project Evidence for AI / LLM Engineering Roles": "面向 AI / LLM 工程岗位的项目证据",
    "Each project is written with the same recruiter-focused structure: Problem, My Ownership, Tech Stack, and Measurable Output.": "每个项目都按招聘导向结构编写：Problem、My Ownership、Tech Stack、Measurable Output。",
    "Model Engineering": "模型工程",
    "LLM Systems": "LLM 系统",
    "LLM / Model Application Engineering": "LLM / 模型应用工程",
    "Problem:": "问题背景：",
    "My Ownership:": "我的职责：",
    "Open-source LLM training projects are often hard to reproduce end-to-end in constrained local environments.": "开源 LLM 训练项目通常难以在受限本地环境中端到端复现。",
    "Real-world LLM applications require stable deployment chains, not just model demos.": "真实场景下的 LLM 应用需要稳定部署链路，而不只是模型演示。",
    "Ran a 5-step deployment chain from data to service response, completed end-to-end verification, and published deployment evidence video.": "跑通 5 步部署链路（数据到服务响应），完成端到端验证并发布部署证据视频。",
    "Voice-to-task workflows often break between speech recognition and downstream action execution.": "语音到任务的工作流常在语音识别与下游执行之间断链。",
    "Delivered a complete runnable loop: voice input -> transcript parsing -> email workflow execution.": "交付完整可运行闭环：voice input -> transcript parsing -> email workflow execution。",
    "Product Build": "产品构建",
    "AI Product and Application Development": "AI 产品与应用开发",
    "Geometry education tools often lack progressive challenge design and interactive feedback loops.": "几何教育工具常缺少渐进式挑战设计与交互反馈闭环。",
    "Perception": "感知",
    "Computer Vision and BCI Engineering": "计算机视觉与 BCI 工程",
    "Brain-computer interaction applications need robust signal-to-command conversion under noisy EEG conditions.": "脑机交互应用在噪声 EEG 条件下需要稳定的信号到指令转换。",
    "Target roles: LLM Application Engineer Intern, AI Developer Intern, and AI Product Engineering Intern. This page summarizes my technical scope, project ownership, and measurable outcomes for fast hiring evaluation.": "目标岗位：LLM 应用工程实习、AI 开发实习、AI 产品工程实习。本页概括我的技术范围、项目职责与可量化结果，便于快速招聘评估。",
    "5 End-to-End Projects": "5 个端到端项目",
    "Core Stack": "核心技术栈",
    "AI Product Engineering": "AI Product Engineering",
    "AI Product Development": "AI Product Development",
    "LLM Application": "LLM Application",
    "Computer Vision": "Computer Vision",
    "BCI": "BCI",
    "Database": "Database",
    "Tech Stack:": "技术栈：",
    "Measurable Output:": "可量化产出：",
    "Independently executed the full MiniMind pipeline from pretraining to SFT, LoRA fine-tuning, and evaluation/inference.": "独立跑通 MiniMind 全流程：从预训练到 SFT、LoRA 微调，再到评估与推理。",
    "Completed 4 core pipeline stages (Pretrain, SFT, LoRA, Eval) with reproducible local runs and validated checkpoint continuation workflow.": "完成 4 个核心阶段（Pretrain、SFT、LoRA、Eval）可复现本地运行，并验证断点续训流程。",
    "Completed local environment setup, training data preparation, model tuning configuration, API service startup, and chatbot platform connection.": "完成本地环境搭建、训练数据准备、模型调参配置、API 服务启动与聊天平台连接。",
    "Integrated speech recognition and email task processing into a usable productivity-oriented AI prototype.": "将语音识别与邮件任务处理整合为可用的效率型 AI 原型。",
    "Implemented a complete desktop geometry learning app with seven staged modules (2D, 3D, angle, circle, composite shape, sector, stage challenge).": "实现完整桌面几何学习应用，覆盖 7 个阶段模块（2D、3D、角度、圆、组合图形、扇形、关卡挑战）。",
    "Built 7 runnable learning modules, unified score feedback flow, and persistent progress display for productized learning interaction.": "完成 7 个可运行学习模块、统一评分反馈流程和可持续进度展示，形成产品化学习交互。",
    "Implemented EEG-oriented signal processing and BCI interaction workflow for practical experiment scenarios.": "实现面向 EEG 的信号处理与 BCI 交互流程，支持实际实验场景。",
    "Speech pipeline, workflow orchestration, and LLM-assisted task flow integration.": "语音处理管线、工作流编排与 LLM 辅助任务流集成。",
    "Delivered a runnable prototype pipeline covering preprocessing, feature extraction, and interaction output.": "交付可运行原型链路，覆盖预处理、特征提取与交互输出。",
    "EEG signal processing, feature engineering, and interaction pipeline implementation.": "EEG 信号处理、特征工程与交互流程实现。",
    "LLM Application, AI Product Engineering, Computer Vision, BCI, Database": "LLM Application, AI Product Engineering, Computer Vision, BCI, Database",
    "Python, PyTorch, Transformers, LangChain, SQL, Docker, OpenAI API, Java.": "Python、PyTorch、Transformers、LangChain、SQL、Docker、OpenAI API、Java。",
    "Python, PyTorch, Transformers, LangChain, SQL, Docker, OpenAI API, Java": "Python、PyTorch、Transformers、LangChain、SQL、Docker、OpenAI API、Java",
    "LLM Workflow Delivery": "LLM 工作流交付",
    "can execute pretraining, SFT, LoRA fine-tuning, and inference validation in reproducible steps.": "可按可复现步骤执行预训练、SFT、LoRA 微调与推理验证。",
    ": can execute pretraining, SFT, LoRA fine-tuning, and inference validation in reproducible steps.": "：可按可复现步骤执行预训练、SFT、LoRA 微调与推理验证。",
    "Deployment Debugging": "部署与调试",
    "able to complete environment setup, service orchestration, and issue diagnosis for local AI services.": "能够完成本地 AI 服务的环境搭建、服务编排与问题定位。",
    ": able to complete environment setup, service orchestration, and issue diagnosis for local AI services.": "：能够完成本地 AI 服务的环境搭建、服务编排与问题定位。",
    "Project Breadth": "项目广度",
    "5 end-to-end projects across LLM, AI product, computer vision, and BCI tasks.": "覆盖 LLM、AI 产品、计算机视觉与 BCI 的 5 个端到端项目。",
    ": 5 end-to-end projects across LLM, AI product, computer vision, and BCI tasks.": "：覆盖 LLM、AI 产品、计算机视觉与 BCI 的 5 个端到端项目。",
    "Research Output": "研究产出",
    "2 published papers and 1 paper currently under review.": "2 篇已发表论文，1 篇在审论文。",
    ": 2 published papers and 1 paper currently under review.": "：2 篇已发表论文，1 篇在审论文。",
    "Practical Prototypes": "可运行原型",
    "delivered runnable pipelines including WhisperMail and BCI-SSVEP implementations.": "已交付可运行流程，包括 WhisperMail 与 BCI-SSVEP 实现。",
    ": delivered runnable pipelines including WhisperMail and BCI-SSVEP implementations.": "：已交付可运行流程，包括 WhisperMail 与 BCI-SSVEP 实现。"
  };

  const ZH_TO_EN = Object.fromEntries(Object.entries(EN_TO_ZH).map(function(entry) {
    return [entry[1], entry[0]];
  }));

  const EN_TO_ZH_PLACEHOLDER = {
    "Try: LLM / project / contact": "试试：LLM / 项目 / 联系",
    "Search episodes": "搜索分集"
  };

  const ZH_TO_EN_PLACEHOLDER = Object.fromEntries(Object.entries(EN_TO_ZH_PLACEHOLDER).map(function(entry) {
    return [entry[1], entry[0]];
  }));

  const MESSAGES = {
    zh: {
      search: {
        unavailable: "搜索暂不可用，请稍后重试。",
        noResults: "没有找到匹配内容。",
        indexLoading: "搜索索引正在初始化，请稍候。",
        error: "搜索发生错误，请换个关键词重试。"
      },
      tagView: {
        title: "标签视图",
        tagPrefix: "标签：{value}",
        categoryPrefix: "分类：{value}",
        noParam: "请在 URL 中提供 <code>?tag=...</code> 或 <code>?category=...</code>。",
        noItems: "没有找到与 {type} “{value}” 匹配的内容。",
        error: "加载标签/分类列表时发生错误。"
      },
      listening: {
        totalEpisodes: "共 {total} 集",
        currentProgress: "第 {episode} 集 / 共 {total} 集",
        unnamedEpisode: "未命名分集",
        noMatchedEpisode: "没有匹配到相关分集。",
        pageInfo: "第 {current} 页 / 共 {total} 页",
        playing: "播放中",
        play: "播放",
        lastEpisode: "已经是最后一集。",
        firstEpisode: "已经是第一集。",
        loadFailed: "音频列表加载失败，请稍后重试。",
        chooseStart: "请选择一集开始播放",
        loadingList: "正在加载音频列表..."
      },
      theme: {
        dark: "深色",
        light: "浅色",
        aria: "切换深浅主题"
      }
    },
    en: {
      search: {
        unavailable: "Search is temporarily unavailable. Please try again later.",
        noResults: "No matching content found.",
        indexLoading: "Search index is still initializing. Please wait a moment.",
        error: "Search failed. Please try a different keyword."
      },
      tagView: {
        title: "Tag View",
        tagPrefix: "Tag: {value}",
        categoryPrefix: "Category: {value}",
        noParam: "Please provide <code>?tag=...</code> or <code>?category=...</code> in the URL.",
        noItems: "No items found for {type} \"{value}\".",
        error: "Something went wrong while loading the list."
      },
      listening: {
        totalEpisodes: "Total {total} episodes",
        currentProgress: "Episode {episode} / {total}",
        unnamedEpisode: "Untitled Episode",
        noMatchedEpisode: "No matching episodes found.",
        pageInfo: "Page {current} / {total}",
        playing: "Playing",
        play: "Play",
        lastEpisode: "Already the last episode.",
        firstEpisode: "Already the first episode.",
        loadFailed: "Failed to load audio list. Please try again later.",
        chooseStart: "Choose an episode to start",
        loadingList: "Loading audio list..."
      },
      theme: {
        dark: "Dark",
        light: "Light",
        aria: "Toggle color theme"
      }
    }
  };

  function normalizeLanguage(lang) {
    return lang === "zh" ? "zh" : "en";
  }

  function inferLanguageFromNavigator() {
    return navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function getPageKey() {
    const raw = window.location.pathname || "";
    const cleaned = raw.replace(/^\/+/, "");
    return cleaned || "index.html";
  }

  function getMessage(path, fallback, vars) {
    const parts = path.split(".");
    let cursor = MESSAGES[currentLanguage];

    for (let i = 0; i < parts.length; i += 1) {
      const key = parts[i];
      if (!cursor || typeof cursor !== "object" || !(key in cursor)) {
        cursor = fallback || path;
        break;
      }
      cursor = cursor[key];
    }

    if (typeof cursor !== "string") {
      cursor = fallback || path;
    }

    if (!vars) return cursor;
    return cursor.replace(/\{([a-zA-Z0-9_]+)\}/g, function(_, name) {
      return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : "";
    });
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) return true;
    const tag = node.parentElement.tagName;
    return tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT";
  }

  function translateTextNodes(map) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let textNode;

    while ((textNode = walker.nextNode())) {
      if (shouldSkipNode(textNode)) continue;

      const original = textNode.nodeValue;
      const trimmed = original.trim();
      if (!trimmed) continue;

      const translated = map[trimmed];
      if (!translated) continue;

      const start = original.indexOf(trimmed);
      const end = start + trimmed.length;
      textNode.nodeValue = original.slice(0, start) + translated + original.slice(end);
    }
  }

  function translatePlaceholders(map) {
    document.querySelectorAll("input[placeholder]").forEach(function(input) {
      const current = (input.getAttribute("placeholder") || "").trim();
      const translated = map[current];
      if (translated) {
        input.setAttribute("placeholder", translated);
      }
    });
  }

  function applyPageTitle(lang) {
    const key = getPageKey();
    const conf = TITLE_BY_PAGE[key];
    if (!conf) return;
    document.title = lang === "zh" ? conf.zh : conf.en;
  }

  function readCachedAutoLanguage() {
    const language = localStorage.getItem(AUTO_LANG_CACHE_KEY);
    const time = Number(localStorage.getItem(AUTO_LANG_CACHE_TIME_KEY) || "0");
    if (!language || !time) return null;
    if (Date.now() - time > AUTO_LANG_CACHE_TTL) return null;
    return normalizeLanguage(language);
  }

  function writeCachedAutoLanguage(lang) {
    localStorage.setItem(AUTO_LANG_CACHE_KEY, lang);
    localStorage.setItem(AUTO_LANG_CACHE_TIME_KEY, String(Date.now()));
  }

  async function fetchJsonWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(function() {
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (_) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  async function detectLanguageByIP() {
    const cached = readCachedAutoLanguage();
    if (cached) return cached;

    const probes = [
      async function() {
        const data = await fetchJsonWithTimeout("https://ipapi.co/json/", 2000);
        if (!data) return null;
        const code = String(data.country_code || "").toUpperCase();
        if (!code) return null;
        return code === "CN" ? "zh" : "en";
      },
      async function() {
        const data = await fetchJsonWithTimeout("https://ipwho.is/", 2000);
        if (!data) return null;
        const code = String(data.country_code || "").toUpperCase();
        if (!code) return null;
        return code === "CN" ? "zh" : "en";
      }
    ];

    for (let i = 0; i < probes.length; i += 1) {
      const result = await probes[i]();
      if (result === "zh" || result === "en") {
        writeCachedAutoLanguage(result);
        return result;
      }
    }

    return null;
  }

  function ensureLanguageSwitcher() {
    const darkToggle = document.getElementById("darkModeToggle");
    if (!darkToggle || !darkToggle.parentElement) return;

    let controls = darkToggle.parentElement.querySelector(".header-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "header-controls";
      darkToggle.parentElement.insertBefore(controls, darkToggle);
      controls.appendChild(darkToggle);
    }

    if (controls.querySelector("#langSwitch")) return;

    const switcher = document.createElement("button");
    switcher.id = "langSwitch";
    switcher.className = "lang-switch";
    switcher.type = "button";
    switcher.innerHTML = '<span class="lang-primary">EN</span><span class="lang-sep">/</span><span class="lang-secondary">中</span>';
    controls.insertBefore(switcher, darkToggle);

    switcher.addEventListener("click", function() {
      const nextLang = currentLanguage === "zh" ? "en" : "zh";
      setLanguage(nextLang, true);
    });
  }

  function updateLanguageSwitcher() {
    const switcher = document.getElementById("langSwitch");
    if (!switcher) return;
    const isZh = currentLanguage === "zh";
    switcher.classList.toggle("is-zh", isZh);
    switcher.setAttribute("aria-label", isZh ? "切换到英文" : "Switch to Chinese");
    switcher.setAttribute("title", isZh ? "切换到英文" : "Switch to Chinese");
    switcher.innerHTML = isZh
      ? '<span class="lang-primary">中</span><span class="lang-sep">/</span><span class="lang-secondary">EN</span>'
      : '<span class="lang-primary">EN</span><span class="lang-sep">/</span><span class="lang-secondary">中</span>';
  }

  function applyLanguage(lang, source) {
    currentLanguage = normalizeLanguage(lang);
    document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";

    const textMap = currentLanguage === "zh" ? EN_TO_ZH : ZH_TO_EN;
    const placeholderMap = currentLanguage === "zh" ? EN_TO_ZH_PLACEHOLDER : ZH_TO_EN_PLACEHOLDER;

    translateTextNodes(textMap);
    translatePlaceholders(placeholderMap);
    applyPageTitle(currentLanguage);
    updateLanguageSwitcher();

    localStorage.setItem(LANG_STORAGE_KEY, currentLanguage);
    if (source === "manual") {
      localStorage.setItem(MANUAL_OVERRIDE_KEY, "1");
    }

    document.dispatchEvent(new CustomEvent("site-language-changed", {
      detail: { lang: currentLanguage }
    }));
  }

  function setLanguage(lang, manual) {
    applyLanguage(lang, manual ? "manual" : "auto");
  }

  function init() {
    ensureLanguageSwitcher();

    const manualOverride = localStorage.getItem(MANUAL_OVERRIDE_KEY) === "1";
    const storedLanguage = normalizeLanguage(localStorage.getItem(LANG_STORAGE_KEY));
    const fallback = inferLanguageFromNavigator();

    setLanguage(storedLanguage || fallback, false);

    if (!manualOverride) {
      detectLanguageByIP().then(function(detected) {
        if (!detected) return;
        if (detected !== currentLanguage) {
          setLanguage(detected, false);
        }
      });
    }
  }

  window.siteI18n = {
    getLanguage: function() {
      return currentLanguage;
    },
    setLanguage: function(lang) {
      setLanguage(lang, true);
    },
    t: function(path, fallback, vars) {
      return getMessage(path, fallback, vars);
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();

