#!/usr/bin/env node

/**
 * Fateblog Markdown 构建脚本
 * 将 posts/ 目录下的 .md 文件转换为 HTML 页面
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: false,
});

// 博客配置
const BLOG_CONFIG = {
  title: 'Fatetech命运科技',
  baseUrl: '/',
  postsDir: path.join(__dirname, 'posts'),
  outputDir: path.join(__dirname, 'posts'),
  templateFile: path.join(__dirname, 'templates', 'post-template.html'),
};

// 文章数据（用于首页）
const BLOG_POSTS_DATA = [
  {
    id: 1,
    title: 'Hello World - 我的第一篇博客',
    description: '开始记录我的博客之旅，分享我的想法和技术笔记。',
    date: '2024-01-15',
    tags: ['简介', 'Hello World'],
    image: 'https://picsum.photos/seed/blog1/400/200',
    readTime: '3 分钟',
  },
  {
    id: 2,
    title: 'GitHub Actions 自动化部署指南',
    description: '如何使用 GitHub Actions 实现博客的自动部署和持续集成。',
    date: '2024-01-20',
    tags: ['GitHub', 'DevOps', 'CI/CD'],
    image: 'https://picsum.photos/seed/blog2/400/200',
    readTime: '8 分钟',
  },
  {
    id: 3,
    title: '现代 CSS 布局技巧',
    description: '深入探讨 Flexbox 和 Grid 在现代网页设计中的应用。',
    date: '2024-01-25',
    tags: ['CSS', '前端', '布局'],
    image: 'https://picsum.photos/seed/blog3/400/200',
    readTime: '10 分钟',
  },
  {
    id: 4,
    title: 'JavaScript 异步编程完全指南',
    description: '从回调函数到 async/await，全面理解 JavaScript 异步编程。',
    date: '2024-02-01',
    tags: ['JavaScript', '异步', '编程'],
    image: 'https://picsum.photos/seed/blog4/400/200',
    readTime: '15 分钟',
  },
  {
    id: 5,
    title: '响应式设计最佳实践',
    description: '打造在不同设备上都有优秀体验的网页设计。',
    date: '2024-02-10',
    tags: ['响应式', '设计', '移动端'],
    image: 'https://picsum.photos/seed/blog5/400/200',
    readTime: '7 分钟',
  },
  {
    id: 6,
    title: 'TypeScript 入门与实践',
    description: '从零开始学习 TypeScript，提升代码质量和开发效率。',
    date: '2024-02-15',
    tags: ['TypeScript', '类型系统', '前端'],
    image: 'https://picsum.photos/seed/blog6/400/200',
    readTime: '12 分钟',
  },
];

// 从 Markdown frontmatter 提取元数据
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      metadata: {
        title: '未命名文章',
        description: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
      },
      content: content,
    };
  }

  const metadataStr = match[1];
  const contentBody = match[2];

  const metadata = {};
  const lines = metadataStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // 处理数组格式
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .substring(1, value.length - 1)
        .split(',')
        .map((v) => v.trim().replace(/["']/g, ''))
        .filter((v) => v.length > 0);
    }

    metadata[key] = value;
  }

  return {
    metadata,
    content: contentBody.trim(),
  };
}

// 生成文章模板
function generatePostTemplate(postMetadata, htmlContent) {
  const { title, description, date, tags = [] } = postMetadata;

  const tagsHtml = tags
    .map((tag) => `<span class="post-tag">${tag}</span>`)
    .join('\n                        ');

  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | ${BLOG_CONFIG.title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${tags.join(', ')}">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/harmonyos-sans@1.0.0/dist/index.css">
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="apple-touch-icon" href="../favicon.svg">
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="../index.html" class="logo">
                    <span class="logo-icon">F</span>
                    <span class="logo-text">${BLOG_CONFIG.title}</span>
                </a>
                <div class="nav-links">
                    <a href="../index.html" class="nav-link">首页</a>
                    <a href="../about/index.html" class="nav-link">关于</a>
                    <button id="theme-toggle" class="theme-toggle" aria-label="切换主题">
                        <span class="icon-sun">☀️</span>
                        <span class="icon-moon">🌙</span>
                    </button>
                </div>
            </nav>
        </div>
    </header>

    <main class="main post-page">
        <div class="container">
            <article class="post-article">
                <header class="post-header">
                    <div class="post-header-tags">
                        ${tagsHtml}
                    </div>
                    <h1 class="post-header-title">${title}</h1>
                    <div class="post-meta">
                        <span class="post-meta-item">📅 ${formattedDate}</span>
                        <span class="post-meta-item">⏱ ${postMetadata.readTime || '5 分钟阅读'}</span>
                    </div>
                </header>

                <div class="post-body">
                    ${htmlContent}
                    <a href="../index.html" class="back-to-list">← 返回文章列表</a>
                </div>
            </article>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <p>&copy; ${new Date().getFullYear()} ${BLOG_CONFIG.title}. All rights reserved.</p>
                </div>
                <div class="footer-bottom">
                    <p>Powered by <strong>GitHub Pages</strong> & <strong>GitHub Actions</strong></p>
                </div>
            </div>
        </div>
    </footer>

    <script src="../js/main.js"></script>
</body>
</html>`;
}

// 构建文章页面
function buildPost(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata, content: mdContent } = parseFrontmatter(content);

    // 转换 Markdown 为 HTML
    const htmlContent = marked.parse(mdContent);

    // 生成完整页面
    const fullHtml = generatePostTemplate(metadata, htmlContent);

    // 写入 HTML 文件
    const outputFilePath = filePath.replace('.md', '.html');
    fs.writeFileSync(outputFilePath, fullHtml, 'utf-8');

    console.log(`  ✅ ${path.basename(filePath)} → ${path.basename(outputFilePath)}`);

    return metadata;
  } catch (error) {
    console.error(`  ❌ 错误处理 ${path.basename(filePath)}:`, error.message);
    return null;
  }
}

// 构建所有文章
function buildAllPosts() {
  console.log('📝 开始构建博客文章...\n');

  // 创建模板目录
  const templatesDir = path.join(__dirname, 'templates');
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  // 获取所有 Markdown 文件
  const mdFiles = fs.readdirSync(BLOG_CONFIG.postsDir).filter((file) => file.endsWith('.md'));

  if (mdFiles.length === 0) {
    console.log('  ⚠️  没有找到 Markdown 文件');
    return [];
  }

  const metadataList = [];

  for (const file of mdFiles) {
    const filePath = path.join(BLOG_CONFIG.postsDir, file);
    const metadata = buildPost(filePath);
    if (metadata) {
      metadataList.push(metadata);
    }
  }

  console.log(`\n✅ 构建完成！共处理 ${metadataList.length} 篇文章\n`);
  return metadataList;
}

// 清理旧的 HTML 文件（保留 Markdown 源文件）
function cleanupOldHtml() {
  const htmlFiles = fs.readdirSync(BLOG_CONFIG.postsDir).filter((file) => file.endsWith('.html'));

  for (const file of htmlFiles) {
    const filePath = path.join(BLOG_CONFIG.postsDir, file);
    const correspondingMd = filePath.replace('.html', '.md');

    // 只删除没有对应 .md 文件的 .html
    if (!fs.existsSync(correspondingMd)) {
      fs.unlinkSync(filePath);
      console.log(`  🗑️  清理旧文件: ${file}`);
    }
  }
}

// 主函数
async function main() {
  console.log('🚀 Fatetech命运科技 - 博客构建系统\n');

  // 清理旧文件
  cleanupOldHtml();

  // 构建文章
  buildAllPosts();

  console.log('🎉 构建完成！');
  console.log('📄 访问 index.html 查看博客\n');
}

// 运行主函数
main().catch((error) => {
  console.error('❌ 构建失败:', error);
  process.exit(1);
});
