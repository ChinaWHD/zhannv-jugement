require('dotenv').config(); // 加载.env文件中的环境变量
const express = require('express');
const path = require('path');
const OpenAI = require('openai'); // 安装: npm install openai
const app = express();
const PORT = 4000;

// JSON解析中间件，用于解析POST请求体
app.use(express.json());

// 创建OpenAI客户端，使用DeepSeek端点
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY
});

// 添加重试机制的API调用函数
async function callDeepSeekWithRetry(options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`尝试API调用 ${i+1}/${maxRetries}...`);
      const completion = await openai.chat.completions.create(options);
      console.log('API调用成功');
      return completion;
    } catch (error) {
      console.error(`尝试 ${i+1}/${maxRetries} 失败:`, error);
      
      // 如果是最后一次重试，则抛出错误
      if (i === maxRetries - 1) throw error;
      
      // 等待时间随重试次数增加
      const waitTime = 1000 * (i + 1);
      console.log(`等待 ${waitTime}ms 后重试...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// 准备判定渣男系统提示的函数
function getJudgmentSystemPrompt(name, format) {
  if (format === "judgment") {
    return `你是元宇宙衙门的情感判官，负责评判用户提交的情感问题，根据人类情感道德准则分析判定"渣男"行为。
请根据用户输入的故事内容，形成一份渣男判决书，文笔略带古风风格，但要符合当代5-45岁年轻人喜好，略带诙谐幽默轻松的表达方式。不需要输出标题和格式，只需要输出分析内容。

具体要求：
1. 总结分析用户输入的故事内容中人物被评为渣男的原因
2. 内容不超过200字，尽可能简明扼要
3. 只输出原因分析，不要输出其他内容或开场白
4. 最后必须给出一个0-100的渣度评分
5. 分析中要称呼当事人为"男人${name}"，不能出现其他人称
6. 文字表达要有轻松诙谐的风格，符合当代年轻人喜好

输出示例：
"经查，男人${name}明知已有女友，却故意隐瞒真相，与他人暧昧不清，且屡教不改，实乃情场老油条，花言巧语信手拈来，真情实感不过尔尔。如此三心二意，脚踏两船，诚为渣度爆表之典范。渣度评分：85%"`;
  } else {
    return "你是元宇宙衙门的情感判官，负责评判用户提交的情感问题，尤其是对'渣男'行为的判定。请分析以下情感经历，给出是否属于'渣男行为'的判定，以及理由和建议。";
  }
}

// 生成降级回复的函数
function getFallbackResponse(type, name = '') {
  if (type === 'chat') {
    return {
      message: {
        role: "assistant",
        content: "很抱歉，我们的服务器暂时繁忙，无法处理您的请求。请稍后再试。如有紧急情况，请咨询其他情感顾问。"
      }
    };
  } else if (type === 'judgment') {
    return {
      rating: "系统繁忙",
      explanation: `经查，男人${name}的行为需要进一步调查。由于系统繁忙，无法完成全面分析。请稍后再试提交判定。渣度评分：待定`
    };
  }
}

// 请求日志和响应头设置
app.use((req, res, next) => {
  console.log(`请求: ${req.method} ${req.url}`);
  
  // 只为HTML路由设置HTML内容类型
  if (req.url.endsWith('.html') || req.url === '/') {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }
  
  next();
});

// 聊天API端点
app.post('/api/chat', async (req, res) => {
  try {
    console.log('收到聊天请求:', JSON.stringify(req.body, null, 2));
    const text = req.body.text;
    
    if (!text) {
      console.log('错误: 请求缺少text字段');
      return res.status(400).json({ error: '请提供聊天内容', response: '抱歉，我没有接收到您的问题。' });
    }
    
    try {
      console.log('调用DeepSeek API...');
      const completion = await callDeepSeekWithRetry({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是元宇宙衙门的情感顾问，擅长倾听和理解用户的情感问题，并给予温暖、专业的建议。请以友好、亲切的语气回应用户，避免过于复杂或晦涩的语言。"
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
      });
      
      // 返回AI回复
      const responseText = completion.choices[0].message.content;
      console.log('聊天回复内容:', responseText.substring(0, 100) + '...');
      res.json({
        response: responseText
      });
    } catch (error) {
      console.error('DeepSeek API调用失败:', error);
      // 返回降级回复
      console.log('返回降级回复');
      res.json(getFallbackResponse('chat'));
    }
  } catch (error) {
    console.error('请求处理失败:', error);
    res.status(500).json({ error: '服务器错误', response: '很抱歉，服务器暂时出现问题，请稍后再试。' });
  }
});

// 分析API端点
app.post('/api/analyze', async (req, res) => {
  try {
    console.log('收到渣男判定请求:', req.body);
    const text = req.body.text;
    const name = req.body.name || "某甲";
    const format = req.body.format || "normal";
    
    const systemPrompt = getJudgmentSystemPrompt(name, format);
    
    try {
      const completion = await callDeepSeekWithRetry({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
      });
      
      // 格式化输出
      const analysis = {
        rating: "判定结果", // 需要从回复中提取
        explanation: completion.choices[0].message.content
      };
      
      console.log('判定结果:', analysis);
      res.json(analysis);
    } catch (error) {
      console.error('DeepSeek API调用失败:', error);
      // 返回降级回复
      console.log('返回降级回复');
      res.json(getFallbackResponse('judgment', name));
    }
  } catch (error) {
    console.error('分析API调用失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// 根路径显式返回index.html
app.get('/', (req, res) => {
  console.log('处理根路径请求');
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      console.error('发送index.html出错:', err);
      res.status(500).send('<h1>服务器错误</h1><p>' + err.message + '</p>');
    }
  });
});

// 其他路径
app.get('*', (req, res) => {
  const requestPath = req.path;
  console.log('处理路径:', requestPath);
  
  // 如果是明确的文件路径，尝试提供
  if (requestPath.includes('.')) {
    res.sendFile(path.join(__dirname, 'public', requestPath), (err) => {
      if (err) {
        console.error('发送文件出错:', err);
        res.sendFile(path.join(__dirname, 'public', 'index.html'), (err2) => {
          if (err2) {
            res.status(500).send('<h1>服务器错误</h1><p>' + err.message + '</p>');
          }
        });
      }
    });
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
      if (err) {
        console.error('发送index.html出错:', err);
        res.status(500).send('<h1>服务器错误</h1><p>' + err.message + '</p>');
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});