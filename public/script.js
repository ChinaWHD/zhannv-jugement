// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const drum = document.getElementById('drum');
    const storyForm = document.getElementById('storyForm');
    const storyInput = document.getElementById('storyInput');
    const sideJudgmentContent = document.getElementById('sideJudgmentContent');
    const characterItems = document.querySelectorAll('.character-item');
    const juryItems = document.querySelectorAll('.jury-item');
    
    // 创建音频对象
    const drumSound = new Audio('./sounds/drum-sound.mp3');
    
    // 当前选择的角色和陪审团
    let selectedCharacter = null;
    let selectedJury = [];
    
    // 为鼓添加点击事件
    drum.addEventListener('click', function() {
        // 播放鼓声
        drumSound.currentTime = 0; // 重置音频
        drumSound.play();
        
        // 添加动画效果
        drum.classList.add('animate__animated', 'animate__tada');
        
        // 动画结束后移除类
        setTimeout(() => {
            drum.classList.remove('animate__animated', 'animate__tada');
        }, 1000);
    });
    
    // 为角色选择添加点击事件
    characterItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他角色的选中状态
            characterItems.forEach(char => char.classList.remove('selected'));
            
            // 设置当前角色为选中状态
            this.classList.add('selected');
            selectedCharacter = this.getAttribute('data-character');
            
            // 显示动画效果
            this.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        });
    });
    
    // 为陪审团选择添加点击事件
    juryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 切换选中状态
            this.classList.toggle('selected');
            
            const juryType = this.getAttribute('data-jury');
            
            // 更新陪审团数组
            if (this.classList.contains('selected')) {
                // 如果已经选择了3个陪审团成员，移除最早选择的一个
                if (selectedJury.length >= 3) {
                    const removedJury = selectedJury.shift();
                    document.querySelector(`[data-jury="${removedJury}"]`).classList.remove('selected');
                }
                selectedJury.push(juryType);
            } else {
                selectedJury = selectedJury.filter(jury => jury !== juryType);
            }
            
            // 显示动画效果
            this.classList.add('animate__animated', 'animate__bounce');
            setTimeout(() => {
                this.classList.remove('animate__animated', 'animate__bounce');
            }, 1000);
        });
    });
    
    // 为表单提交添加事件
    storyForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // 获取用户输入的故事
        const story = storyInput.value.trim();
        
        // 验证输入
        if (!story) {
            alert('请输入故事内容');
            return;
        }
        
        // 显示加载状态
        document.querySelector('.submit-btn').innerHTML = '判决中...';
        document.querySelector('.submit-btn').disabled = true;
        
        // 调用API生成判决书
        generateJudgment(story);
    });
    
    // 调用Deepseek API生成判决书
    async function generateJudgment(story) {
        try {
            // 构建提示词
            const prompt = buildPrompt(story);
            
            // 调用API
            const response = await callDeepseekAPI(prompt);
            
            // 解析响应
            parseAndDisplayJudgment(response, story);
            
        } catch (error) {
            console.error('生成判决书时出错:', error);
            alert('生成判决书时出错，请重试');
            
            // 恢复按钮状态
            document.querySelector('.submit-btn').innerHTML = '公审渣男';
            document.querySelector('.submit-btn').disabled = false;
        }
    }
    
    // 构建提示词
    function buildPrompt(story) {
        return `
            请为以下故事内容生成一份"渣男判决书"。判决书的要求：

            1. 居中标题写上：渣男判决书
            2. 第二行顶格上：男人+故事中人物的名称（不要出现其他人称）
            3. 第三行起缩进两格写上：总结分析故事中人物被评为渣男的原因，不超过80字，尽可能简明扼要，只输出原因，不要输出其他
            4. 倒数第二行居中写上：故事中对人物渣度的总评分（只输出数字）
            5. 最后一行在判决书页面右下角写上：包青天批

            故事内容：${story}

            请使用古风风格的文笔，严格按照以上格式输出判决书内容。
        `;
    }
    
    // 调用Deepseek API
    async function callDeepseekAPI(prompt) {
        // 从环境变量获取API密钥
        const apiKey = 'YOUR_DEEPSEEK_API_KEY'; // 实际开发中应该从环境变量获取
        
        // 这里是示例代码，实际使用时应替换为Deepseek API的真实端点和参数
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            throw new Error(`API调用失败: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // 解析响应并显示判决书
    function parseAndDisplayJudgment(response, story) {
        // 获取API返回的文本
        // 注意：这里的路径可能需要根据Deepseek API的实际响应格式调整
        const judgmentText = response.choices[0].message.content;
        
        // 分解判决书内容
        const lines = judgmentText.split('\n').filter(line => line.trim() !== '');
        
        // 提取判决书各部分内容
        let title = '';
        let defendant = '';
        let reason = '';
        let score = '';
        let signature = '';
        
        // 解析判决书内容
        if (lines.length >= 5) {
            title = lines[0].trim();
            defendant = lines[1].trim();
            
            // 合并分析原因（可能有多行）
            const reasonEndIndex = lines.length - 2;
            const reasonLines = lines.slice(2, reasonEndIndex);
            reason = reasonLines.join('\n');
            
            score = lines[reasonEndIndex].trim();
            signature = lines[reasonEndIndex + 1].trim();
        } else {
            // 如果API返回格式不符合预期，尝试从文本中提取关键信息
            title = '渣男判决书';
            
            // 尝试从故事中提取人物名称
            const nameMatch = story.match(/([^\s，。,:：]+)/);
            defendant = nameMatch ? `男人${nameMatch[1]}` : '男人某某';
            
            // 使用API返回的全部内容作为原因
            reason = judgmentText;
            
            score = '渣度总评分：80分';
            signature = '包青天批';
        }
        
        // 更新判决书内容
        sideJudgmentContent.innerHTML = `
    <h3 class="judgment-title">${title}</h3>
    <p class="judgment-defendant">${defendant}</p>
    <p class="judgment-reason">${reason}</p>
    <p class="judgment-score">${score}</p>
    <p class="judgment-signature">${signature}</p>
`;
        
        // 显示判决书区域动画
        const scrollContainer = document.querySelector('.scroll-container');
        scrollContainer.classList.add('animate__animated', 'animate__fadeIn');
        
        // 恢复按钮状态
        document.querySelector('.submit-btn').innerHTML = '公审渣男';
        document.querySelector('.submit-btn').disabled = false;
        
        // 滚动到判决书区域
        scrollContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 默认选择第一个角色
    if (characterItems.length > 0) {
        characterItems[0].click();
    }
    
    // 随机鼓的动画效果
    setInterval(() => {
        if (Math.random() > 0.8) {
            drum.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                drum.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
        }
    }, 5000);
});