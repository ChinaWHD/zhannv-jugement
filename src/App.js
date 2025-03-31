import React, { useState, useEffect } from 'react';
import './App.css';
import { getChatResponse, generateJudgment } from './api/deepseekAPI';

// 导入组件
import Header from './components/Header';
import CharacterSelection from './components/CharacterSelection';
import InputForm from './components/InputForm';
import JudgmentReport from './components/JudgmentReport';
import Animation from './components/Animation';

function App() {
  console.log("App组件正在渲染"); // 添加的测试输出
  
  // 状态管理
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedJury, setSelectedJury] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [showJudgment, setShowJudgment] = useState(false);
  const [judgment, setJudgment] = useState({
    title: '渣男判决书',
    defendant: '男人某某',
    reason: '分析原因将在这里显示',
    score: '渣度总评分：90分',
    signature: '包青天批'
  });
  const [isLoading, setIsLoading] = useState(false);

  // 角色数据
  const characters = [
    {
      id: 'cyber-judge',
      name: '赛博狄仁杰',
      image: './assets/images/characters/cyber-judge.jpg', // 图片路径需要更新
      skill: '微表情大数据分析',
      quote: '元芳，你怎么看这个'晚安=去蹦迪'的定律？'
    },
    {
      id: 'animal-judge',
      name: '疯狂动物城',
      image: './assets/images/characters/animal-judge.jpg', // 图片路径需要更新
      skill: '爪爪测谎仪',
      quote: '本豹宣布：你的借口比树懒还慢！'
    },
    {
      id: 'emperor-judge',
      name: '甄嬛·AI版',
      image: './assets/images/characters/emperor-judge.jpg', // 图片路径需要更新
      skill: '宫斗话术拆解',
      quote: '翠果！给本宫打烂这'只当妹妹'的嘴！'
    },
    {
      id: 'thanos-judge',
      name: '灭霸·鉴渣版',
      image: './assets/images/characters/thanos-judge.jpg', // 图片路径需要更新
      skill: '无限宝石渣力检测',
      quote: '你的渣男浓度...值得一个响指！'
    }
  ];

  // 陪审团数据
  const juryMembers = [
    { id: 'friend', name: '【毒舌闺蜜】', quote: '这都不分？菩萨都得给你让座！' },
    { id: 'dog', name: '【二哈陪审员】', quote: '汪汪！他比我的狗粮保质期还短！' },
    { id: 'audience', name: '【吃瓜群众】', quote: 'V我50，解锁被告开房记录（bushi' },
    { id: 'boss', name: '【霸道总裁】', quote: '天凉了，该让渣男破产了' },
    { id: 'meng-po', name: '【孟婆AI】', quote: '来，喝了这碗忘情水再看聊天记录' }
  ];

  // 处理鼓的点击事件
  const handleDrumClick = () => {
    // 播放鼓声
    const drumSound = new Audio('./sounds/drum-sound.mp3');
    drumSound.play();
    
    // 添加初始消息
    if (chatHistory.length === 0) {
      setChatHistory([
        {
          role: 'assistant',
          content: '欢迎来到元宇宙衙门！我是你的AI助手。请告诉我你的情感经历，或者上传相关聊天记录，我会帮你分析并生成渣男判决书。'
        }
      ]);
    }
  };

  // 处理消息发送 - 修改为实际调用API
  const handleSendMessage = async (message) => {
    // 先添加用户消息到聊天历史
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);
    
    try {
      // 调用Deepseek API获取回复
      const response = await getChatResponse(message);
      
      // 添加AI回复到聊天历史
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('获取AI回复出错:', error);
      // 出错时添加错误消息
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，暂时无法处理您的请求，请稍后再试。' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理图片上传
  const handleImageUpload = (image) => {
    // 处理图片上传逻辑
    setChatHistory([
      ...chatHistory,
      { role: 'user', content: '上传了一张图片', image },
      // 模拟AI回复
      { role: 'assistant', content: '我看到了这张图片，能否告诉我更多关于这段关系的细节？' }
    ]);
  };

  // 处理陪审团选择
  const handleJurySelection = (juryId) => {
    if (selectedJury.includes(juryId)) {
      setSelectedJury(selectedJury.filter(id => id !== juryId));
    } else if (selectedJury.length < 3) {
      setSelectedJury([...selectedJury, juryId]);
    } else {
      // 如果已经选择了3个，替换第一个
      setSelectedJury([...selectedJury.slice(1), juryId]);
    }
  };

  // 生成判决书 - 修改为实际调用API
  const generateJudgmentHandler = async () => {
    setIsLoading(true);
    
    try {
      // 整合聊天历史为一个故事
      const userMessages = chatHistory
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('\n');
      
      // 调用API生成判决书
      const judgmentResult = await generateJudgment(userMessages);
      
      // 更新判决书状态
      setJudgment(judgmentResult);
      setShowJudgment(true);
    } catch (error) {
      console.error('生成判决书出错:', error);
      alert('生成判决书时出错，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {/* 页面头部组件 */}
      <Header />

      {/* 法庭主体区域 */}
      <main className="court-main">
        <div className="court-content">
          {/* 左侧角色选择区域 */}
          <CharacterSelection 
            characters={characters}
            juryMembers={juryMembers}
            selectedCharacter={selectedCharacter}
            selectedJury={selectedJury}
            onSelectCharacter={setSelectedCharacter}
            onSelectJury={handleJurySelection}
          />
          
          {/* 中央互动区域 */}
          <div className="center-area">
            {/* 鼓动画组件 */}
            <Animation onDrumClick={handleDrumClick} />
            
            {/* 聊天或判决书区域 */}
            {!showJudgment ? (
              <InputForm 
                onSendMessage={handleSendMessage}
                onImageUpload={handleImageUpload}
                onGenerateJudgment={generateJudgmentHandler}
                chatHistory={chatHistory}
                showGenerateButton={chatHistory.length > 4}
                isLoading={isLoading}
              />
            ) : (
              <JudgmentReport 
                judgment={judgment}
                onReturn={() => setShowJudgment(false)}
                isRightSide={false}
              />
            )}
          </div>
          
          {/* 右侧判决书区域 */}
          <JudgmentReport 
            judgment={judgment}
            isRightSide={true}
          />
        </div>
      </main>
      
      {/* 页面底部 */}
      <footer className="court-footer">
        <p className="disclaimer">本庭判决结合2000部霸总小说+300G分手短信生成，现实情感问题请拨打12338妇联热线！</p>
      </footer>
    </div>
  );
}

export default App;