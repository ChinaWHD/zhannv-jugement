# 🦹♂️「元宇宙衙门」渣男公审大会

![版本](https://img.shields.io/badge/版本-1.0.0-brightgreen)
![许可证](https://img.shields.io/badge/许可证-MIT-blue)

## 项目介绍

"元宇宙衙门渣男公审大会"是一个互动性网站，用户可以输入故事内容，系统会调用Deepseek R1模型生成古风风格的"渣男判决书"。网站以中国古代衙门为主题，融合现代元素，为用户提供有趣的交互体验。

> "呔！大胆渣男哪里逃！欢迎来到《21世纪渣男审判司》——在这里，AI包青天手握《渣男法典》，民间陪审团携带表情包炮弹！"

## 🌟 主要功能

- **角色选择系统**: 用户可以选择不同的主判官角色和陪审团成员
- **鸣冤鼓**: 点击鼓开始审判流程，并伴随音效
- **故事输入**: 用户可以输入自己的故事内容
- **AI生成判决书**: 调用Deepseek R1模型生成古风风格的"渣男判决书"
- **动态效果**: 网站包含多种动画效果，提升用户体验

## 🔧 技术栈

- 前端: HTML5, CSS3, JavaScript (React)
- API集成: Deepseek R1模型
- 动画: Animate.css
- 打包工具: Webpack
- 部署: Netlify

## 📥 安装与运行

### 前提条件

- Node.js >= 14.0.0
- npm >= 6.0.0
- Deepseek API密钥

### 步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/your-username/zhannv-judgment.git
   cd zhannv-judgment
2. 安装依赖
   ```bash
   npm install
3. 设置环境变量
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，添加 Deepseek API 密钥
4. 运行开发服务器
   ```bash
   npm run start
   #应用将在 http://localhost:8080 运行
5. 构建生产版本
   ```bash
   npm run build
6. 部署
   ```bash
   npm run deploy
   # 部署到 Netlify

### 项目结构

/zhannv-judgment
├── /public
│   ├── index.html               # 网站主入口HTML文件
│   ├── styles.css               # 网站样式表
│   ├── script.js                # 主JavaScript文件
│   └── /sounds
│       └── drum-sound.mp3       # 鼓声音效
├── /src
│   ├── /components
│   │   ├── Header.js            # 页头组件
│   │   ├── InputForm.js         # 用户输入表单组件
│   │   ├── JudgmentReport.js    # 渣男判决书组件
│   │   ├── CharacterSelection.js # 角色选择组件
│   │   └── Animation.js         # 动画组件
│   ├── /api
│   │   └── deepseekAPI.js       # 调用Deepseek API的模块
│   └── App.js                   # 应用主组件
├── /assets
│   ├── /images
│   │   ├── background.jpg       # 网站背景图
│   │   ├── drum.jpg             # 鼓的图片
│   │   └── scroll.jpg           # 卷轴图片
│   └── /animations              # 动画资源目录
├── package.json                 # 项目依赖和配置文件
├── README.md                    # 项目说明文件
└── .env                         # 环境变量文件

### API集成  

本项目使用Deepseek R1模型生成渣男判决书。API集成在 src/api/deepseekAPI.js 中实现，提供以下功能:

生成结构化的提示词
调用Deepseek API
解析API响应
格式化判决书内容

### 渣男判决书格式

生成的判决书遵循以下格式:

居中标题: 渣男判决书
第二行顶格: 男人+故事中人物名称
第三行起缩进两格: 总结分析人物被评为渣男的原因(不超过80字)
倒数第二行居中: 对人物渣度的总评分
最后一行右下角: 包青天批

### 许可证

MIT License

### 贡献

欢迎提交问题和提交请求！

### 免责声明

本网站判决结果仅供娱乐，不代表真实法律意见。现实情感问题请拨打12338妇联热线。

