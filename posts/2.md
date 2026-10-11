---
title: "GitHub Actions 自动化部署指南"
description: "如何使用 GitHub Actions 实现博客的自动部署和持续集成。"
date: "2026-01-20"
tags: ["GitHub", "DevOps", "CI/CD"]
readTime: "8 分钟"
---

GitHub Actions 是 GitHub 平台提供的强大的持续集成和持续部署（CI/CD）工具。它可以自动化各种工作流，包括构建、测试、部署等。本文将介绍如何使用 GitHub Actions 实现博客的自动部署。

## 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的自动化工作流工具，支持在代码仓库中定义和执行自动化流程。主要特点包括：

- ✅ 基于 YAML 的工作流定义
- ✅ 支持多种触发条件（push、pull request、定时等）
- ✅ 丰富的 Actions 市场
- ✅ 免费的计算资源（对于公开仓库）
- ✅ 与 GitHub 深度集成

## 基本概念

### Workflow（工作流）

工作流是 GitHub Actions 的基本单元，定义在 `.github/workflows/` 目录下的 YAML 文件中。

### Job（作业）

作业是工作流中的一个任务，可以包含多个步骤。多个作业可以串行或并行执行。

### Step（步骤）

步骤是作业中的单个操作，可以是运行命令、使用 Actions 等。

## GitHub Actions 部署博客的完整流程

### 1. 创建仓库

```bash
git init
git remote add origin https://github.com/username/repo.git
```

### 2. 配置工作流文件

在仓库根目录下创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: actions/deploy-pages@v4
```

### 3. 启用 GitHub Pages

在仓库设置中启用 Pages，并选择 GitHub Actions 作为源：

- Settings → Pages
- Source: GitHub Actions
- Branch: main

### 4. 推送代码触发部署

```bash
git add .
git commit -m "Add blog with GitHub Actions deploy"
git push origin main
```

## 实用技巧

### 缓存依赖

使用缓存可以加速构建过程：

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### 并行部署

可以同时部署到多个环境：

```yaml
jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-preview@v1
      - uses: actions/deploy-production@v1
```

### 环境变量管理

在仓库设置中配置环境变量，保持代码安全：

- Secrets：敏感信息如 API 密钥
- Variables：非敏感配置如版本号

## 常见问题

### Q: 为什么部署没有触发？

A: 检查工作流文件路径是否正确，确认分支名称匹配，检查触发条件配置。

### Q: 如何调试工作流？

A: 查看 Actions 标签页中的运行日志，添加调试步骤，使用 `echo` 输出信息。

### Q: 部署速度太慢怎么办？

A: 使用缓存、减少不必要步骤、优化构建配置、使用更轻量的构建工具。

## 总结

GitHub Actions 是自动化部署的绝佳工具。通过合理配置工作流，可以实现代码提交到网站的完全自动化。本文介绍了基本概念和最佳实践，希望能帮助你更好地使用 GitHub Actions。

> "自动化不是奢侈品，而是必需品。"
