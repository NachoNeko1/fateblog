---
title: "JavaScript 异步编程完全指南"
description: "从回调函数到 async/await，全面理解 JavaScript 异步编程。"
date: "2026-02-01"
tags: ["JavaScript", "异步", "编程"]
readTime: "15 分钟"
---

异步编程是 JavaScript 的核心特性之一。理解异步编程对于构建高性能的 Web 应用至关重要。本文将从回调函数开始，逐步介绍 Promise、async/await 等现代异步编程模式。

## 为什么需要异步编程？

JavaScript 是单线程语言，如果执行一个耗时操作（如网络请求、文件读写），会阻塞整个线程，导致页面卡顿。异步编程允许在等待操作完成时继续执行其他代码。

## 回调函数（Callback）

### 基本用法

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { message: 'Hello World' };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log(data.message);
});
```

### 回调地狱（Callback Hell）

当嵌套多层回调时，代码可读性会急剧下降：

```javascript
getUser(function(user) {
  getPosts(user.id, function(posts) {
    getComments(posts[0].id, function(comments) {
      // 深层嵌套，难以维护
    });
  });
});
```

## Promise

### 基本概念

Promise 代表一个异步操作的最终结果，有三种状态：

- **Pending**：待定
- **Fulfilled**：已成功
- **Rejected**：已失败

### 创建 Promise

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      resolve('成功！');
    } catch (error) {
      reject(error);
    }
  }, 1000);
});
```

### 处理 Promise

```javascript
promise
  .then((value) => {
    console.log(value);
    return value + ' 继续处理';
  })
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error('出错了：', error);
  })
  .finally(() => {
    console.log('无论成功失败都会执行');
  });
```

### 常用静态方法

```javascript
// 并行执行
Promise.all([promise1, promise2])
  .then(([result1, result2]) => { /* ... */ });

// 返回第一个完成的
Promise.race([promise1, promise2])
  .then(result => { /* ... */ });

// 任一成功
Promise.any([promise1, promise2])
  .then(result => { /* ... */ });

// 全部完成（无论成功失败）
Promise.allSettled([promise1, promise2])
  .then(results => { /* ... */ });
```

## async/await

### 基本用法

`async/await` 是 Promise 的语法糖，让异步代码看起来像同步代码：

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败：', error);
    throw error;
  }
}
```

### 对比 Promise

```javascript
// Promise 链式调用
function getVersion1() {
  return getUser()
    .then(user => getPosts(user.id))
    .then(posts => getComments(posts[0].id))
    .then(comments => processComments(comments))
    .catch(error => console.error(error));
}

// async/await
async function getVersion2() {
  try {
    const user = await getUser();
    const posts = await getPosts(user.id);
    const comments = await getComments(posts[0].id);
    return processComments(comments);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

### 并行执行

需要并行执行多个异步操作时，使用 `Promise.all`：

```javascript
async function getData() {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);
  
  return { users, posts, comments };
}
```

## 错误处理

### try/catch

```javascript
async function safeAsync() {
  try {
    await riskyOperation();
  } catch (error) {
    if (error.code === 'TIMEOUT') {
      // 重试逻辑
    } else {
      throw error; // 重新抛出
    }
  }
}
```

### Promise.catch

```javascript
fetchData()
  .then(processData)
  .catch(handleError)
  .finally(cleanup);
```

## 最佳实践

- ✅ 优先使用 async/await
- ✅ 始终处理 Promise 的 rejection
- ✅ 使用 Promise.all 并行执行独立操作
- ✅ 避免在循环中使用 await（除非必须顺序执行）
- ✅ 设置超时时间
- ✅ 添加重试机制
- ✅ 使用 Promise 包装回调函数

### 循环优化示例

```javascript
// ❌ 顺序执行（慢）
async function slowLoop(items) {
  for (const item of items) {
    await process(item);
  }
}

// ✅ 并行执行（快）
async function fastLoop(items) {
  await Promise.all(items.map(item => process(item)));
}

// ✅ 控制并发数
async function limitedLoop(items, concurrency = 5) {
  const results = [];
  const executing = [];
  
  for (const item of items) {
    const p = process(item).then(result => {
      executing.splice(executing.indexOf(p), 1);
      return result;
    });
    results.push(p);
    executing.push(p);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}
```

## 总结

JavaScript 异步编程从回调发展到 Promise，再到 async/await，语法越来越简洁，可读性也越来越好。掌握这些异步模式，能够让你编写出更健壮、更高效的代码。

> "异步不是逃避现实，而是拥抱未来。"
