#!/usr/bin/env node

/**
 * Fatetech命运科技 Markdown 构建脚本
 * 将 posts 目录下的 index.md 文件转换为 HTML 页面
 * 动态生成首页（含搜索功能、按时间排序）
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
  randomImagePc: 'https://pic.rkn.cc.cd/',
  randomImageMobile: 'https://pic2.rkn.cc.cd/',
};

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

// 生成文章页面
function generatePostTemplate(postMetadata, htmlContent, postPath) {
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
    <link rel="icon" type="image/png" href="../favicon.png">
    <link rel="apple-touch-icon" href="../favicon.png">
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
            </div>
        </div>
    </footer>

    <script src="../js/main.js"></script>
</body>
</html>`;
}

// 构建文章页面
function buildPost(postId) {
  try {
    const postDir = path.join(BLOG_CONFIG.postsDir, postId);
    const mdFile = path.join(postDir, 'index.md');

    if (!fs.existsSync(mdFile)) {
      console.log(`  ⚠️  跳过 ${postId}: 未找到 index.md`);
      return null;
    }

    const content = fs.readFileSync(mdFile, 'utf-8');
    const { metadata, content: mdContent } = parseFrontmatter(content);

    // 转换 Markdown 为 HTML
    const htmlContent = marked.parse(mdContent);

    // 生成完整页面
    const fullHtml = generatePostTemplate(metadata, htmlContent, postId);

    // 写入 HTML 文件
    const outputFilePath = path.join(postDir, 'index.html');
    fs.writeFileSync(outputFilePath, fullHtml, 'utf-8');

    console.log(`  ✅ ${postId}/index.md → ${postId}/index.html`);

    // 检查是否有封面图片
    const picFile = path.join(postDir, 'pic.png');
    const hasPic = fs.existsSync(picFile);

    return {
      id: postId,
      ...metadata,
      image: hasPic ? `${postId}/pic.png` : null,
      hasPic: hasPic,
    };
  } catch (error) {
    console.error(`  ❌ 错误处理 ${postId}:`, error.message);
    return null;
  }
}

// 构建所有文章
function buildAllPosts() {
  console.log('📝 开始构建博客文章...\n');

  // 获取所有文章文件夹
  const postDirs = fs.readdirSync(BLOG_CONFIG.postsDir).filter((dir) => {
    return fs.statSync(path.join(BLOG_CONFIG.postsDir, dir)).isDirectory();
  });

  if (postDirs.length === 0) {
    console.log('  ⚠️  没有找到文章文件夹');
    return [];
  }

  const metadataList = [];

  for (const dir of postDirs) {
    const metadata = buildPost(dir);
    if (metadata) {
      metadataList.push(metadata);
    }
  }

  // 按日期排序（由晚到早）
  metadataList.sort((a, b) => new Date(b.date) - new Date(a.date));

  console.log(`\n✅ 构建完成！共处理 ${metadataList.length} 篇文章\n`);
  return metadataList;
}

// 生成首页
function generateIndexHtml(postsData) {
  const postsJson = JSON.stringify(postsData);
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${BLOG_CONFIG.title} - 我的博客</title>
    <meta name="description" content="${BLOG_CONFIG.title} - 记录生活与技术，探索未知">
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/harmonyos-sans@1.0.0/dist/index.css">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="favicon.png">
    <link rel="apple-touch-icon" href="favicon.png">
</head>
<body>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <a href="index.html" class="logo">
                    <span class="logo-icon">F</span>
                    <span class="logo-text">${BLOG_CONFIG.title}</span>
                </a>
                <div class="nav-links">
                    <a href="index.html" class="nav-link active">首页</a>
                    <a href="about/index.html" class="nav-link">关于</a>
                    <button id="theme-toggle" class="theme-toggle" aria-label="切换主题">
                        <span class="icon-sun">☀️</span>
                        <span class="icon-moon">🌙</span>
                    </button>
                </div>
            </nav>
        </div>
    </header>

    <main class="main">
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title">欢迎来到 ${BLOG_CONFIG.title}</h1>
                    <p class="hero-description">记录生活、分享技术、探索未知</p>
                    <div class="hero-tags">
                        <span class="tag"># 技术博客</span>
                        <span class="tag"># 生活随笔</span>
                        <span class="tag"># 学习笔记</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Search Section -->
        <section class="search-section">
            <div class="container">
                <div class="search-box">
                    <input type="text" id="search-input" placeholder="🔍 搜索文章..." autocomplete="off">
                    <span class="search-count" id="search-count"></span>
                </div>
            </div>
        </section>

        <!-- Blog Posts Section -->
        <section class="posts-section">
            <div class="container">
                <h2 class="section-title">最新文章</h2>
                <div class="posts-grid" id="posts-grid">
                    <!-- Blog Post Cards will be inserted here by JavaScript -->
                </div>
                <div class="no-results" id="no-results" style="display: none;">
                    <p>😕 没有找到匹配的文章</p>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <p>&copy; ${new Date().getFullYear()} ${BLOG_CONFIG.title}. All rights reserved.</p>
                    <p class="footer-links">
                        <a href="https://github.com/NachoNeko1" target="_blank">GitHub</a>
                        <span class="separator">|</span>
                        <a href="mailto:y1964829632@163.com">Email</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Blog posts data (generated by build.js)
        const blogPosts = ${postsJson};

        // Random image URLs
        const isAndroid = /Android/i.test(navigator.userAgent);
        const randomImagePc = '${BLOG_CONFIG.randomImagePc}';
        const randomImageMobile = '${BLOG_CONFIG.randomImageMobile}';
        const randomImage = isAndroid ? randomImageMobile : randomImagePc;

        // Render blog posts
        function renderPosts(posts) {
            const postsGrid = document.getElementById('posts-grid');
            const noResults = document.getElementById('no-results');

            if (posts.length === 0) {
                postsGrid.style.display = 'none';
                noResults.style.display = 'block';
                return;
            }

            postsGrid.style.display = 'grid';
            noResults.style.display = 'none';

            postsGrid.innerHTML = posts.map(post => {
                const imageSrc = post.image || randomImage + '?t=' + Date.now();
                const imageStyle = post.image ? '' : 'style="background-size: cover;"';
                
                return \`
                    <article class="post-card" data-title="\${post.title}" data-description="\${post.description}" data-tags="\${post.tags.join(', ')}">
                        <div class="post-image" \${imageStyle}>
                            <img src="\${imageSrc}" alt="\${post.title}" loading="lazy" \${!post.image ? 'style="display: none;"' : ''}>
                            <div class="post-date">\${post.date}</div>
                        </div>
                        <div class="post-content">
                            <div class="post-tags">
                                \${post.tags.map(tag => \`<span class="post-tag">\${tag}</span>\`).join('')}
                            </div>
                            <h3 class="post-title"><a href="posts/\${post.id}/index.html">\${post.title}</a></h3>
                            <p class="post-description">\${post.description}</p>
                            <div class="post-footer">
                                <span class="post-read-time">⏱ \${post.readTime || '5 分钟'}</span>
                                <a href="posts/\${post.id}/index.html" class="read-more">阅读全文 →</a>
                            </div>
                        </div>
                    </article>
                \`;
            }).join('');
        }

        // Search functionality
        function initSearch() {
            const searchInput = document.getElementById('search-input');
            const searchCount = document.getElementById('search-count');

            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                
                if (query === '') {
                    renderPosts(blogPosts);
                    searchCount.textContent = '';
                    return;
                }

                const filteredPosts = blogPosts.filter(post => {
                    const titleMatch = post.title.toLowerCase().includes(query);
                    const descMatch = post.description.toLowerCase().includes(query);
                    const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
                    return titleMatch || descMatch || tagsMatch;
                });

                renderPosts(filteredPosts);
                searchCount.textContent = filteredPosts.length + ' 篇文章';
            });
        }

        // Theme toggle functionality
        function initThemeToggle() {
            const themeToggle = document.getElementById('theme-toggle');
            const savedTheme = localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }

        // Dynamic Background - PC vs Android adaptive
        function initDynamicBackground() {
            document.body.style.backgroundImage = \`url('\${randomImage}?t=\${Date.now()}')\`;
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            renderPosts(blogPosts);
            initSearch();
            initThemeToggle();
            initDynamicBackground();
        });
    </script>
</body>
</html>`;
}

// 生成首页
function buildIndex() {
  const postsData = buildAllPosts();
  const indexHtml = generateIndexHtml(postsData);
  fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml, 'utf-8');
  console.log('✅ index.html 已生成\n');
}

// 主函数
async function main() {
  console.log('🚀 Fatetech命运科技 - 博客构建系统\n');
  buildIndex();
  console.log('🎉 构建完成！');
  console.log('📄 访问 index.html 查看博客\n');
}

// 运行主函数
main().catch((error) => {
  console.error('❌ 构建失败:', error);
  process.exit(1);
});
