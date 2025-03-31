const express = require('express');
const path = require('path');
const app = express();
const PORT = 9876;

// 添加明确的响应头
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  next();
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 最简单的路由
app.get('/', (req, res) => {
  res.send('<!DOCTYPE html><html><head><title>测试</title></head><body><h1>元宇宙衙门</h1><p>这是一个测试页面</p></body></html>');
});

app.listen(PORT, () => {
  console.log(`简易服务器运行在 http://localhost:${PORT}`);
});