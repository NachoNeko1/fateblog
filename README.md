# Fateblog 🚀

一个现代、简约的个人博客，使用纯 HTML/CSS/JavaScript 构建，通过 GitHub Pages 和 GitHub Actions 自动部署。

## ✨ 功能特点

- **现代设计** - 简洁美观的 UI，支持深色/浅色主题切换
- **响应式布局** - 完美适配手机、平板、桌面设备
- **自动部署** - 通过 GitHub Actions 一键部署到 GitHub Pages
- **博客系统** - 支持多篇文章、标签分类、统计功能
- **性能优化** - 纯静态站点，加载速度快，无依赖
- **SEO 友好** - 语义化 HTML，合理的 meta 标签

## 📁 项目结构

```
Fateblog/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── about/
│   └── index.html              # 关于页面
├── assets/                     # 静态资源
├── css/
│   └── style.css               # 样式文件
├── js/
│   └── main.js                 # JavaScript 文件
├── posts/                      # 博客文章
│   ├── 1.html
│   ├── 2.html
│   ├── 3.html
│   ├── 4.html
│   ├── 5.html
│   └── 6.html
├── index.html                  # 首页
├── .gitignore
└── README.md                   # 项目说明
```

## 🚀 快速开始

### 方法一：使用 GitHub 仓库

1. **创建新仓库**
   ```bash
   # 在 GitHub 上创建一个新的仓库（例如：fateblog）
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/your-username/fateblog.git
   cd fateblog
   ```

3. **替换文件**
   将本项目的文件复制到仓库中。

4. **提交并推送**
   ```bash
   git add .
   git commit -m "Initial commit: Setup blog"
   git push origin main
   ```

5. **启用 GitHub Pages**
   - 进入 GitHub 仓库 → Settings → Pages
   - 选择 Source: GitHub Actions
   - Branch: main

### 方法二：直接上传

1. 在 GitHub 上创建新仓库
2. 点击 "Upload files"
3. 上传本项目所有文件
4. 推送到 main 分支

## 🎨 自定义博客

### 修改博客信息

1. **首页信息** - 编辑 `index.html`
   - 博客名称和描述
   - 博客统计数据
   - 文章列表（在 JavaScript 部分）

2. **关于页面** - 编辑 `about/index.html`
   - 个人简介
   - 技能标签
   - 联系方式

3. **样式调整** - 编辑 `css/style.css`
   - 颜色主题（在 CSS 变量中）
   - 字体设置
   - 布局间距

### 添加新文章

1. 在 `posts/` 目录下创建新文件（如 `7.html`）
2. 复制现有文章模板（如 `6.html`）
3. 修改文章标题、内容、日期、标签等
4. 在 `index.html` 的 JavaScript 部分添加文章信息：

```javascript
const blogPosts = [
    // ... 现有文章
    {
        id: 7,
        title: "新文章标题",
        description: "文章描述",
        date: "2024-03-01",
        tags: ["标签1", "标签2"],
        image: "https://picsum.photos/seed/blog7/400/200",
        readTime: "5 分钟"
    }
];
```

## 📦 部署流程

### 自动部署（GitHub Actions）

当推送到 `main` 分支时，GitHub Actions 会自动触发部署：

1. 检出代码
2. 验证文件
3. 部署到 GitHub Pages

**部署配置文件**: `.github/workflows/deploy.yml`

### 手动部署

可以在 GitHub Actions 页面手动触发工作流：

1. 进入仓库 → Actions
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow"

## 🔧 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代化样式
- **JavaScript** - 交互式功能
- **GitHub Pages** - 静态托管
- **GitHub Actions** - 自动化部署
- **Google Fonts** - 字体（Noto Sans SC, JetBrains Mono）

## 🌟 主题自定义

### 颜色配置

在 `css/style.css` 中修改 CSS 变量：

```css
:root {
    --primary-color: #6c5ce7;      /* 主色调 */
    --secondary-color: #00cec9;    /* 辅助色 */
    --accent-color: #fd79a8;       /* 强调色 */
}
```

### 深色主题

```css
[data-theme="dark"] {
    --text-color: #dfe6e9;
    --bg-color: #0a0a0a;
    --bg-card: #16213e;
}
```

## 📊 功能说明

### 主题切换

- 点击右上角的 🌙/☀️ 图标切换深色/浅色主题
- 主题偏好会保存到 `localStorage`
- 默认根据系统设置自动选择

### 统计数据

- 文章总数
- 阅读量
- 专栏分类
- 订阅者数量

### 文章列表

- 响应式网格布局
- 卡片式展示
- 标签分类
- 阅读时间估算

## 🛠 开发工具

- **VS Code** - 推荐编辑器（安装 Live Server 扩展）
- **Chrome DevTools** - 调试和预览
- **Git** - 版本控制
- **GitHub** - 代码托管

## 📄 许可证

MIT License

## 🙏 致谢

- [GitHub Pages](https://pages.github.com/)
- [GitHub Actions](https://github.com/features/actions)
- [Google Fonts](https://fonts.google.com/)
- [Lorem Picsum](https://picsum.photos/) - 示例图片

---

## 📞 联系方式

- **Email**: admin@example.com
- **GitHub**: https://github.com/your-username
- **Twitter**: https://twitter.com/your-username

---

Made with ❤️ by Fate
