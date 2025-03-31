/**
 * CSS 3D法庭场景 - 简化版
 * 通过CSS 3D变换实现基础3D效果
 */

// 主判官角色池
const JUDGE_CHARACTERS = [
    {
        id: 'neon-judge',
        name: '霓虹包青天',
        specialMove: '刷脸天眼通',
        catchphrase: '天理昭昭，渣男难逃！',
        catchphrase2: '人心叵测，渣男本性难移',
        image: '/assets/characters/neon-judge.jpg'
    },
    {
        id: 'cyber-detective',
        name: '赛博狄仁杰',
        specialMove: '微表情大数据分析',
        catchphrase: '元芳，你怎么看？',
        catchphrase2: '宁可狂揪渣男一千，不可放过一个',
        image: '/assets/characters/cyber-detective.jpg'
    },
    {
        id: 'monk-judge',
        name: '唐僧审渣男',
        specialMove: '紧箍咒连击',
        catchphrase: '你这个渣男，害人精，总有一日要你尝尝痛苦的滋味！',
        catchphrase2: '渣男啊，放下屠刀，回头是岸',
        image: '/assets/characters/monk-judge.jpg'
    }
];

// 陪审团角色池
const JURY_CHARACTERS = [
    {
        id: 'toxic-bestie',
        name: '毒舌闺蜜',
        catchphrase: '这都不分？菩萨都得给你让座！',
        image: '/assets/characters/toxic-friend.jpg'
    },
    {
        id: 'mengpo-ai',
        name: '孟婆AI',
        catchphrase: '来，喝了这碗忘情水再看聊天记录',
        image: '/assets/characters/mengpo.jpg'
    },
    {
        id: 'zhen-hun',
        name: '甄嬛·AI2版',
        catchphrase: '华妃！快赐渣男跪榴莲',
        image: '/assets/characters/zhen-hun.jpg'
    },
    {
        id: 'wukong',
        name: '火眼金睛',
        catchphrase: '俺老孙火眼金睛，一眼看穿你的套路！',
        image: '/assets/characters/monkey-king.jpg'
    },
    {
        id: 'grandma',
        name: '扎心老太太',
        catchphrase: '小伙子，你这样是会失去姑娘的',
        image: '/assets/characters/grandma.jpg'
    },
    {
        id: 'cat',
        name: '无情吸猫机',
        catchphrase: '喵喵喵？（翻译：就这也能叫爱情？）',
        image: '/assets/characters/cat.jpg'
    }
];

// 当前选中的角色
let selectedJudge = null;
let selectedJury = [];
let courtroom3DActive = false;

// DOM元素
let container, characterGrid, judgeElement, juryElements = [];

// 初始化3D场景
function init() {
    // 创建CSS样式
    createStyles();
    
    // 初始化DOM元素
    container = document.getElementById('courtroom-3d');
    if (!container) return;
    
    // 创建法庭场景容器
    createCourtroom();
    
    // 初始化角色选择界面
    initCharacterSelection();
    
    // 监听窗口大小变化
    window.addEventListener('resize', adjustCourtroom);
}

// 创建CSS样式
function createStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
    .courtroom-3d {
        position: relative;
        width: 100%;
        height: 600px;
        perspective: 1000px;
        overflow: hidden;
        background: linear-gradient(to bottom, #f5e6c9, #d9c7a7);
    }
    
    .courtroom-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 1s ease;
    }
    
    .courtroom-floor {
        position: absolute;
        width: 100%;
        height: 100%;
        bottom: 0;
        background-color: #8b0000;
        transform: rotateX(90deg) translateZ(300px);
    }
    
    .courtroom-wall {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #f9e8c9;
        transform: translateZ(-300px);
        background-image: url('/assets/background.jpg'); /* 使用已有的背景图 */
        background-size: cover;
    }
    
    .judge-stand {
        position: absolute;
        width: 300px;
        height: 150px;
        bottom: 0;
        left: 50%;
        margin-left: -150px;
        background-color: #5a0000;
        transform: translateZ(-200px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        border-radius: 10px 10px 0 0;
    }
    
    .jury-stand {
        position: absolute;
        width: 800px;
        height: 120px;
        bottom: 0;
        left: 50%;
        margin-left: -400px;
        background-color: #8b4513;
        transform: translateZ(-100px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-around;
    }
    
    .character {
        position: absolute;
        transition: all 0.5s ease;
        transform-style: preserve-3d;
    }
    
    .character-card {
        width: 150px;
        background-color: #fff;
        border-radius: 10px;
        padding: 10px;
        margin: 10px;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        transform-style: preserve-3d;
        position: relative;
    }
    
    .character-card:hover {
        transform: translateY(-5px) scale(1.05);
    }
    
    .character-card.selected {
        border: 3px solid #8b0000;
        background-color: #fff8f8;
    }
    
    .character-card img {
        width: 100%;
        border-radius: 5px;
        transform: translateZ(10px);
    }
    
    .character-card h4 {
        margin: 10px 0 5px;
        color: #8b0000;
        transform: translateZ(5px);
    }
    
    .character-card p {
        font-size: 12px;
        color: #333;
        margin: 0;
        transform: translateZ(5px);
    }
    
    .judge {
        bottom: 150px;
        left: 50%;
        margin-left: -75px;
        transform: translateZ(-200px);
        z-index: 10;
    }
    
    .jury {
        bottom: 120px;
        transform: translateZ(-100px);
        z-index: 5;
    }
    
    .jury-1 { left: calc(50% - 250px); }
    .jury-2 { left: calc(50% - 0px); }
    .jury-3 { left: calc(50% + 250px); }
    
    .character-select-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin: 20px 0;
    }
    
    .judge-dialogue {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        background-color: white;
        border: 2px solid #8b0000;
        border-radius: 15px;
        padding: 15px 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 100;
        min-width: 300px;
        max-width: 80%;
        text-align: center;
        animation: float 3s infinite ease-in-out;
        transform-style: preserve-3d;
        transform: translateX(-50%) translateZ(50px);
    }
    
    @keyframes float {
        0% { transform: translateX(-50%) translateZ(50px) translateY(0px); }
        50% { transform: translateX(-50%) translateZ(50px) translateY(-15px); }
        100% { transform: translateX(-50%) translateZ(50px) translateY(0px); }
    }
    
    .dialogue-content {
        font-size: 18px;
        color: #333;
        font-family: 'KaiTi', '楷体', serif;
    }
    
    .judge-name {
        color: #8b0000;
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 10px;
    }
    
    .character-selection {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(255,255,255,0.95);
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 800px;
        width: 90%;
    }
    
    .character-selection h3 {
        text-align: center;
        color: #8b0000;
        margin-top: 0;
        font-size: 24px;
    }
    
    .confirm-selection {
        display: block;
        margin: 20px auto 0;
        padding: 12px 30px;
        background-color: #8b0000;
        color: white;
        border: none;
        border-radius: 30px;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .confirm-selection:hover {
        background-color: #5a0000;
        transform: scale(1.05);
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease forwards;
    }
    
    .fade-out {
        animation: fadeOut 0.5s ease forwards;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .selection-tabs {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #ddd;
    }
    
    .selection-tab {
        padding: 10px 20px;
        cursor: pointer;
        margin: 0 10px;
        border-bottom: 3px solid transparent;
    }
    
    .selection-tab.active {
        border-bottom-color: #8b0000;
        color: #8b0000;
        font-weight: bold;
    }
    
    .ranking-scroll-container {
        position: relative;
        flex-grow: 1;
        overflow: hidden;
        height: 200px; /* 确保有固定高度 */
    }
    
    .ranking-scroll {
        position: absolute;
        width: 100%;
        animation: scrollRanking 20s linear infinite;
    }
    
    @keyframes scrollRanking {
        0% { transform: translateY(0); }
        100% { transform: translateY(-100%); }
    }
    
    /* 当排行榜项目hover时暂停滚动 */
    .ranking-scroll:hover {
        animation-play-state: paused;
    }
    
    .case-number-link {
        color: #8b0000;
        font-weight: bold;
        text-decoration: underline;
        cursor: pointer;
        position: absolute;
        top: 10%;
        right: 20%;
        z-index: 25;
        font-size: 16px;
    }
    `;
    document.head.appendChild(style);
}

// 创建法庭场景
function createCourtroom() {
    container.innerHTML = '';
    container.className = 'courtroom-3d';
    
    const courtroomInner = document.createElement('div');
    courtroomInner.className = 'courtroom-inner';
    
    // 创建场景元素
    const floor = document.createElement('div');
    floor.className = 'courtroom-floor';
    
    const wall = document.createElement('div');
    wall.className = 'courtroom-wall';
    
    const judgeStand = document.createElement('div');
    judgeStand.className = 'judge-stand';
    
    const juryStand = document.createElement('div');
    juryStand.className = 'jury-stand';
    
    // 组装场景
    courtroomInner.appendChild(floor);
    courtroomInner.appendChild(wall);
    courtroomInner.appendChild(judgeStand);
    courtroomInner.appendChild(juryStand);
    
    container.appendChild(courtroomInner);
}

// 初始化角色选择界面
function initCharacterSelection() {
    console.log('初始化角色选择界面');
    // 创建角色选择面板
    const selectionPanel = document.getElementById('character-selection');
    if (!selectionPanel) {
        console.error('找不到角色选择面板元素');
        return;
    }
    
    // 清空之前的内容
    selectionPanel.innerHTML = '';
    
    // 添加选择标签页
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'selection-tabs';
    
    const judgeTab = document.createElement('div');
    judgeTab.className = 'selection-tab active';
    judgeTab.textContent = '选择主判官';
    judgeTab.addEventListener('click', () => {
        showJudgesPanel();
        judgeTab.classList.add('active');
        juryTab.classList.remove('active');
    });
    
    const juryTab = document.createElement('div');
    juryTab.className = 'selection-tab';
    juryTab.textContent = '选择陪审团';
    juryTab.addEventListener('click', () => {
        showJuryPanel();
        juryTab.classList.add('active');
        judgeTab.classList.remove('active');
    });
    
    tabsContainer.appendChild(judgeTab);
    tabsContainer.appendChild(juryTab);
    selectionPanel.appendChild(tabsContainer);
    
    // 创建主判官选择面板
    const judgeGridContainer = document.createElement('div');
    judgeGridContainer.id = 'judge-selection-container';
    judgeGridContainer.className = 'selection-container';
    judgeGridContainer.style.display = 'block';
    
    const judgeTitle = document.createElement('h3');
    judgeTitle.textContent = '选择1名主判官';
    judgeGridContainer.appendChild(judgeTitle);
    
    const judgeGrid = document.createElement('div');
    judgeGrid.id = 'judge-grid';
    judgeGrid.className = 'character-select-grid';
    judgeGridContainer.appendChild(judgeGrid);
    
    // 创建陪审团选择面板
    const juryGridContainer = document.createElement('div');
    juryGridContainer.id = 'jury-selection-container';
    juryGridContainer.className = 'selection-container';
    juryGridContainer.style.display = 'none';
    
    const juryTitle = document.createElement('h3');
    juryTitle.textContent = '选择3名陪审团成员';
    juryGridContainer.appendChild(juryTitle);
    
    // 创建陪审团网格
    const juryGrid = document.createElement('div');
    juryGrid.id = 'jury-grid';
    juryGrid.className = 'character-select-grid';
    juryGridContainer.appendChild(juryGrid);
    
    // 将两个面板添加到选择面板
    selectionPanel.appendChild(judgeGridContainer);
    selectionPanel.appendChild(juryGridContainer);
    
    // 为每个容器添加单独的确认按钮
    
    // 主判官选择确认按钮
    const judgeConfirmButton = document.createElement('button');
    judgeConfirmButton.id = 'judge-confirm-selection';
    judgeConfirmButton.className = 'confirm-selection';
    judgeConfirmButton.textContent = '选好主判官，下一步';
    judgeConfirmButton.style.display = 'block';
    judgeConfirmButton.style.margin = '20px auto';
    judgeConfirmButton.style.padding = '10px 20px';
    judgeConfirmButton.style.backgroundColor = '#8b0000';
    judgeConfirmButton.style.color = 'white';
    judgeConfirmButton.style.border = 'none';
    judgeConfirmButton.style.borderRadius = '5px';
    judgeConfirmButton.style.cursor = 'pointer';
    judgeConfirmButton.style.fontSize = '16px';
    judgeGridContainer.appendChild(judgeConfirmButton);
    
    // 陪审团选择确认按钮
    const juryConfirmButton = document.createElement('button');
    juryConfirmButton.id = 'jury-confirm-selection';
    juryConfirmButton.className = 'confirm-selection';
    juryConfirmButton.textContent = '选好陪审团，确认';
    juryConfirmButton.style.display = 'none'; // 初始隐藏，等选满3人后显示
    juryConfirmButton.style.margin = '20px auto';
    juryConfirmButton.style.padding = '10px 20px';
    juryConfirmButton.style.backgroundColor = '#555'; // 开始时呈灰色
    juryConfirmButton.style.color = 'white';
    juryConfirmButton.style.border = 'none';
    juryConfirmButton.style.borderRadius = '5px';
    juryConfirmButton.style.cursor = 'pointer';
    juryConfirmButton.style.fontSize = '16px';
    juryConfirmButton.style.transition = 'background-color 0.3s ease'; // 添加过渡效果
    juryGridContainer.appendChild(juryConfirmButton);
    
    // 添加陪审团确认选择按钮事件
    juryConfirmButton.addEventListener('click', () => {
        console.log('确认陪审团选择按钮被点击');
        
        if (selectedJury.length !== 3) {
            alert('请选择3名陪审团成员');
            return;
        }
        
        // 隐藏选择界面
        document.getElementById('character-selection').style.display = 'none';
        
        // 设置法庭场景
        setupCourtroom();
        
        // 添加交互界面
        addCourtInteraction();
    });
    
    // 创建主判官角色选择器
    populateJudgeGrid();
    
    // 创建陪审团角色选择器
    populateJuryGrid();
    
    // 主判官确认选择按钮事件
    judgeConfirmButton.addEventListener('click', () => {
        console.log('确认主判官选择按钮被点击');
        
        if (!selectedJudge) {
            alert('请选择1名主判官');
            return;
        }
        
        // 切换到陪审团选择
        showJuryPanel();
        juryTab.classList.add('active');
        judgeTab.classList.remove('active');
    });
}

// 显示主判官选择面板
function showJudgesPanel() {
    document.getElementById('judge-selection-container').style.display = 'block';
    document.getElementById('jury-selection-container').style.display = 'none';
}

// 显示陪审团选择面板
function showJuryPanel() {
    // 隐藏主判官选择，显示陪审团选择
    document.getElementById('judge-selection-container').style.display = 'none';
    document.getElementById('jury-selection-container').style.display = 'block';
    
    // 确保陪审团确认按钮可见
    if (document.getElementById('jury-confirm-selection')) {
        document.getElementById('jury-confirm-selection').style.display = 'block';
    } else {
        console.error('无法找到陪审团确认按钮元素');
    }
}

// 填充主判官选择网格
function populateJudgeGrid() {
    const judgeGrid = document.getElementById('judge-grid');
    if (!judgeGrid) return;
    
    judgeGrid.innerHTML = '';
    
    // 创建主判官角色选择器
    JUDGE_CHARACTERS.forEach((character) => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.id = character.id;
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}" onerror="this.src='/assets/characters/placeholder.jpg'">
            <h4>${character.name}</h4>
            <p>${character.catchphrase}</p>
        `;
        
        // 添加选择事件
        card.addEventListener('click', () => {
            toggleJudgeSelection(character, card);
        });
        
        judgeGrid.appendChild(card);
    });
}

// 填充陪审团选择网格
function populateJuryGrid() {
    const juryGrid = document.getElementById('jury-grid');
    if (!juryGrid) return;
    
    juryGrid.innerHTML = '';
    
    // 创建陪审团角色选择器
    JURY_CHARACTERS.forEach((character) => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.id = character.id;
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}" onerror="this.src='/assets/characters/placeholder.jpg'">
            <h4>${character.name}</h4>
            <p>${character.catchphrase}</p>
        `;
        
        // 添加选择事件
        card.addEventListener('click', () => {
            toggleJurySelection(character, card);
        });
        
        juryGrid.appendChild(card);
    });
}

// 切换主判官选择
function toggleJudgeSelection(character, cardElement) {
    // 清除所有已选择的主判官
    document.querySelectorAll('#judge-grid .character-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 选择当前主判官
    cardElement.classList.add('selected');
    selectedJudge = character;
}

// 切换陪审团选择
function toggleJurySelection(character, cardElement) {
    const index = selectedJury.findIndex(c => c.id === character.id);
    
    if (index === -1) {
        // 如果未选择且未达到3人上限
        if (selectedJury.length < 3) {
            selectedJury.push(character);
            cardElement.classList.add('selected');
        }
    } else {
        // 如果已选择，则取消选择
        selectedJury.splice(index, 1);
        cardElement.classList.remove('selected');
    }
    
    // 更新确认按钮状态
    updateJuryConfirmButton();
}

// 更新陪审团确认按钮状态
function updateJuryConfirmButton() {
    console.log('更新陪审团确认按钮状态，当前选择:', selectedJury.length);
    const confirmButton = document.getElementById('jury-confirm-selection');
    if (!confirmButton) {
        console.error('找不到陪审团确认按钮');
        return;
    }
    
    if (selectedJury.length === 3) {
        // 已选满3人，激活按钮
        confirmButton.style.display = 'block';
        confirmButton.style.backgroundColor = '#8b0000';
        confirmButton.style.cursor = 'pointer';
        confirmButton.disabled = false;
    } else {
        // 未选满3人，禁用按钮
        confirmButton.style.display = 'none';
        confirmButton.style.backgroundColor = '#555';
        confirmButton.style.cursor = 'not-allowed';
        confirmButton.disabled = true;
    }
}

// 设置法庭场景
function setupCourtroom() {
    // 如果没有选择陪审员，随机选择三名
    if (!selectedJury || selectedJury.length !== 3) {
        selectedJury = [];
        
        // 随机选择三名不重复的陪审员
        const availableJury = [...JURY_CHARACTERS];
        while (selectedJury.length < 3 && availableJury.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableJury.length);
            selectedJury.push(availableJury[randomIndex]);
            availableJury.splice(randomIndex, 1);
        }
    }
    
    // 如果没有选择主判官，随机选择一名
    if (!selectedJudge) {
        selectedJudge = JUDGE_CHARACTERS[Math.floor(Math.random() * JUDGE_CHARACTERS.length)];
    }
    
    // 创建法官
    createJudge();
    
    // 创建陪审团
    createJury();
    
    // 显示判官台词
    showJudgeCatchphrase();
    
    // 添加简单动画
    animateCourtroom();
    
    // 默认不自动添加交互界面，由陪审团确认按钮逻辑触发
    // addCourtInteraction();
}

// 添加法庭交互界面
function addCourtInteraction() {
    const courtroomInner = container.querySelector('.courtroom-inner');
    
    // 移除已有的交互界面
    const existingUI = container.querySelector('.court-interaction');
    if (existingUI) {
        courtroomInner.removeChild(existingUI);
    }
    
    // 创建交互界面容器
    const interactionPanel = document.createElement('div');
    interactionPanel.className = 'court-interaction';
    interactionPanel.style.position = 'absolute';
    interactionPanel.style.top = '50%'; 
    interactionPanel.style.left = '50%';
    interactionPanel.style.transform = 'translate(-50%, 0)'; 
    interactionPanel.style.width = '72%'; 
    interactionPanel.style.maxWidth = '720px'; 
    interactionPanel.style.background = 'rgba(255, 255, 255, 0.9)';
    interactionPanel.style.borderRadius = '10px';
    interactionPanel.style.padding = '12px'; 
    interactionPanel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    interactionPanel.style.zIndex = '100';
    
    // 添加表单内容，包括图片上传功能
    interactionPanel.innerHTML = `
        <h3 style="color:#8b0000;margin-top:0;text-align:center;">提交证据生成判决书</h3>
        <div style="margin-bottom:8px;">
            <label for="court-defendant-name" style="display:block;margin-bottom:4px;font-weight:bold;">被告人姓名/昵称:</label>
            <input type="text" id="court-defendant-name" style="width:100%;padding:6px;border:1px solid #ccc;border-radius:4px;">
        </div>
        <div style="margin-bottom:8px;">
            <label for="court-evidence" style="display:block;margin-bottom:4px;font-weight:bold;">证据内容(聊天记录/经历描述):</label>
            <textarea id="court-evidence" style="width:100%;height:80px;padding:6px;border:1px solid #ccc;border-radius:4px;resize:none;"></textarea>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:15px;">
            <button id="court-submit" style="background:#8b0000;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;">提交审判</button>
            <label for="court-image-upload" style="display:inline-block;background:#f0f0f0;padding:8px 15px;border-radius:4px;cursor:pointer;text-align:center;">
                <span style="display:inline-block;width:16px;height:16px;background-image:url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><path d=&quot;M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4&quot;></path><polyline points=&quot;17 8 12 3 7 8&quot;></polyline><line x1=&quot;12&quot; y1=&quot;3&quot; x2=&quot;12&quot; y2=&quot;15&quot;></line></svg>');background-repeat:no-repeat;background-position:center;margin-right:5px;"></span>
                上传截图
            </label>
            <input type="file" id="court-image-upload" accept="image/*" style="display:none;" onchange="previewCourtImage(this)">
            <button id="court-cancel" style="background:#333;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer;">返回聊天</button>
        </div>
        <div id="court-image-preview" style="margin-top:10px;text-align:center;"></div>
        <div id="court-loading" style="display:none;text-align:center;margin-top:10px;">
            <div style="display:inline-block;width:20px;height:20px;border:3px solid #8b0000;border-radius:50%;border-top-color:transparent;animation:spin 1s linear infinite;"></div>
            <p style="margin:5px 0 0 0;">正在生成渣男判决书...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    courtroomInner.appendChild(interactionPanel);
    
    // 添加图片预览函数到全局作用域
    window.previewCourtImage = function(input) {
        const preview = document.getElementById('court-image-preview');
        preview.innerHTML = '';
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '200px';
                img.style.borderRadius = '5px';
                preview.appendChild(img);
                
                // 添加删除按钮
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '删除图片';
                removeBtn.style.background = '#f0f0f0';
                removeBtn.style.border = 'none';
                removeBtn.style.borderRadius = '4px';
                removeBtn.style.padding = '5px 10px';
                removeBtn.style.marginTop = '5px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.onclick = function() {
                    preview.innerHTML = '';
                    input.value = '';
                };
                preview.appendChild(removeBtn);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    };
    
    // 添加事件监听
    const submitButton = interactionPanel.querySelector('#court-submit');
    const cancelButton = interactionPanel.querySelector('#court-cancel');
    
    // 提交审判事件
    submitButton.addEventListener('click', function() {
        const name = document.getElementById('court-defendant-name').value.trim();
        const evidence = document.getElementById('court-evidence').value.trim();
        
        if (!name) {
            alert('请输入被告人姓名/昵称');
            return;
        }
        
        if (!evidence) {
            alert('请输入证据内容');
            return;
        }
        
        // 显示加载状态
        document.getElementById('court-loading').style.display = 'block';
        submitButton.disabled = true;
        cancelButton.disabled = true;
        
        // 调用API生成判决书
        generate3DJudgment(name, evidence);
    });
    
    // 取消按钮事件
    cancelButton.addEventListener('click', function() {
        hide3DCourtroom();
    });
}

// 生成3D判决书函数
async function generate3DJudgment(name, evidence) {
    try {
        console.log('发送3D法庭渣男判定请求:', { evidence, name });
        
        // 调用后端API，使用DeepSeek大语言模型
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: evidence,
                format: "judgment",
                name: name,
                model: "deepseek" // 指定使用DeepSeek模型
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            throw new Error(`API请求失败: ${response.status} ${errorText}`);
        }
        
        console.log('收到3D法庭渣男判定响应');
        const data = await response.json();
        console.log('3D判定结果:', data);
        
        // 处理判决结果
        displayCourtResult(name, data);
        
    } catch (error) {
        console.error('3D法庭判决生成失败:', error);
        alert(`生成判决书失败: ${error.message}`);
        
        // 恢复按钮状态
        document.getElementById('court-loading').style.display = 'none';
        document.getElementById('court-submit').disabled = false;
        document.getElementById('court-cancel').disabled = false;
    }
}

// 显示3D法庭判决结果
function displayCourtResult(name, data) {
    const courtroomInner = container.querySelector('.courtroom-inner');
    
    // 移除交互界面
    const interactionUI = container.querySelector('.court-interaction');
    if (interactionUI) {
        courtroomInner.removeChild(interactionUI);
    }
    
    // 生成案例编号
    const caseId = `ZN${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    
    // 提取渣度评分
    const scoreMatch = data.explanation.match(/(\d+)%/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 100);
    
    // 提取行为描述
    const behaviorMatch = data.explanation.match(/主要行为：(.*?)(?=\n|$)/);
    const behavior = behaviorMatch ? behaviorMatch[1].trim() : data.explanation.substring(0, 100) + '...';
    
    // 创建判决书面板
    const judgmentPanel = document.createElement('div');
    judgmentPanel.className = 'court-judgment-result';
    judgmentPanel.style.position = 'absolute';
    judgmentPanel.style.top = '50%';
    judgmentPanel.style.left = '50%';
    judgmentPanel.style.transform = 'translate(-50%, -50%)';
    judgmentPanel.style.width = '57.6%'; 
    judgmentPanel.style.height = '115.2%'; 
    judgmentPanel.style.maxWidth = '432px'; 
    judgmentPanel.style.backgroundImage = 'url("/assets/scroll-bg.jpg")';
    judgmentPanel.style.backgroundSize = 'contain';
    judgmentPanel.style.backgroundPosition = 'center';
    judgmentPanel.style.backgroundRepeat = 'no-repeat';
    judgmentPanel.style.padding = '20px';
    judgmentPanel.style.borderRadius = '10px';
    judgmentPanel.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    judgmentPanel.style.zIndex = '200';
    judgmentPanel.style.minHeight = '480px'; 
    judgmentPanel.style.display = 'flex';
    judgmentPanel.style.flexDirection = 'column';
    judgmentPanel.style.alignItems = 'center';
    judgmentPanel.style.justifyContent = 'center';
    
    // 创建卷轴内容容器 - 确保内容居于卷轴中心
    const scrollContent = document.createElement('div');
    scrollContent.style.width = '57.6%'; 
    scrollContent.style.height = '115.2%'; 
    scrollContent.style.margin = '0 auto';
    scrollContent.style.display = 'flex';
    scrollContent.style.flexDirection = 'column';
    scrollContent.style.alignItems = 'center';
    scrollContent.style.justifyContent = 'center';
    scrollContent.style.backgroundColor = 'rgba(255, 245, 230, 0.5)'; 
    scrollContent.style.padding = '20px';
    scrollContent.style.borderRadius = '10px';
    
    // 添加判决书内容
    scrollContent.innerHTML = `
        <h2 style="color:#8b0000;text-align:center;margin:10px 0;">渣男判决书</h2>
        <p style="text-align:left;margin:15px 0;font-weight:bold;">男人${name}</p>
        <p style="text-align:justify;text-indent:2em;line-height:1.6;margin:15px 0;">${data.explanation}</p>
        <p style="text-align:center;margin:15px 0;font-weight:bold;color:#8b0000;">渣度评分：${score}%</p>
        <p style="text-align:right;margin:15px 0;">公审大会批</p>
        <div style="text-align:center;font-size:0.8em;margin-top:20px;color:#555;">案件编号: ${caseId}</div>
    `;
    
    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.id = 'close-judgment';
    closeButton.textContent = '返回';
    closeButton.style.background = '#8b0000';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '10px 20px';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginTop = '20px';
    closeButton.style.zIndex = '250'; 
    closeButton.style.position = 'relative'; 
    closeButton.style.display = 'block'; 
    
    // 直接绑定事件到按钮
    closeButton.onclick = function() {
        console.log('关闭判决书按钮被点击');
        if (courtroomInner.contains(judgmentPanel)) {
            courtroomInner.removeChild(judgmentPanel);
        }
    };
    
    judgmentPanel.appendChild(scrollContent);
    judgmentPanel.appendChild(closeButton);
    courtroomInner.appendChild(judgmentPanel);
    
    // 添加到排行榜
    addToRankingFromCourt(name, score, behavior, caseId);
    
    // 播放判决音效
    const audio = new Audio('/sounds/gavel.mp3');
    audio.volume = 0.7;
    audio.play().catch(err => console.error('无法播放判决音效:', err));
    
    // 动画效果 - 法官敲锤子
    if (judgeElement) {
        judgeElement.classList.add('judge-animation');
        setTimeout(() => {
            judgeElement.classList.remove('judge-animation');
        }, 1000);
    }
}

// 添加到排行榜
function addToRankingFromCourt(name, score, behavior, caseId) {
    // 获取现有排行榜数据
    let rankings = JSON.parse(localStorage.getItem('zhannv-rankings') || '[]');
    
    // 添加新的判决结果
    rankings.push({
        name: name,
        score: score,
        behavior: behavior,
        caseId: caseId,
        date: new Date().toISOString()
    });
    
    // 排序并保存
    rankings.sort((a, b) => b.score - a.score);
    localStorage.setItem('zhannv-rankings', JSON.stringify(rankings));
    
    // 更新案例计数器
    let caseCounter = parseInt(localStorage.getItem('zhannv-case-counter') || '0');
    caseCounter++;
    localStorage.setItem('zhannv-case-counter', caseCounter.toString());
    
    // 如果主页面有排行榜，也进行更新
    if (window.renderRankings && typeof window.renderRankings === 'function') {
        window.renderRankings();
    }
}

// 创建法官
function createJudge() {
    const courtroomInner = container.querySelector('.courtroom-inner');
    
    // 移除现有法官
    const existingJudge = container.querySelector('.judge');
    if (existingJudge) {
        courtroomInner.removeChild(existingJudge);
    }
    
    // 创建法官元素
    judgeElement = document.createElement('div');
    judgeElement.className = 'character judge';
    judgeElement.innerHTML = `
        <img src="${selectedJudge.image}" alt="${selectedJudge.name}" width="150" height="200" 
             onerror="this.src='/assets/characters/placeholder.jpg'">
        <div class="judge-name">${selectedJudge.name}</div>
    `;
    
    courtroomInner.appendChild(judgeElement);
}

// 创建陪审团
function createJury() {
    const courtroomInner = container.querySelector('.courtroom-inner');
    
    // 移除现有陪审团
    container.querySelectorAll('.jury').forEach(jury => {
        courtroomInner.removeChild(jury);
    });
    
    juryElements = [];
    
    // 创建新陪审团
    selectedJury.forEach((juror, index) => {
        const juryElement = document.createElement('div');
        juryElement.className = `character jury jury-${index + 1}`;
        juryElement.innerHTML = `
            <img src="${juror.image}" alt="${juror.name}" width="100" height="150"
                 onerror="this.src='/assets/characters/placeholder.jpg'">
            <div class="judge-name">${juror.name}</div>
        `;
        
        courtroomInner.appendChild(juryElement);
        juryElements.push(juryElement);
    });
}

// 显示判官台词
function showJudgeCatchphrase() {
    const courtroomInner = container.querySelector('.courtroom-inner');
    
    // 移除现有对话框
    const existingDialogue = container.querySelector('.judge-dialogue');
    if (existingDialogue) {
        courtroomInner.removeChild(existingDialogue);
    }
    
    // 创建对话框
    const dialogueDiv = document.createElement('div');
    dialogueDiv.className = 'judge-dialogue';
    
    // 随机选择台词1或台词2
    const catchphrase = Math.random() > 0.5 ? selectedJudge.catchphrase : selectedJudge.catchphrase2;
    
    dialogueDiv.innerHTML = `
        <div class="dialogue-content">
            <div class="judge-name">${selectedJudge.name}</div>
            "${catchphrase}"
        </div>
    `;
    
    courtroomInner.appendChild(dialogueDiv);
    
    // 5秒后更换台词或隐藏
    setTimeout(() => {
        dialogueDiv.classList.add('fade-out');
        setTimeout(() => {
            if (courtroomInner.contains(dialogueDiv)) {
                courtroomInner.removeChild(dialogueDiv);
            }
            
            // 一定概率显示陪审团成员台词
            if (Math.random() > 0.5) {
                showJuryMemberCatchphrase();
            }
        }, 500);
    }, 5000);
}

// 显示陪审团成员台词
function showJuryMemberCatchphrase() {
    if (selectedJury.length === 0) return;
    
    const courtroomInner = container.querySelector('.courtroom-inner');
    
    // 随机选择一名陪审团成员
    const randomJuror = selectedJury[Math.floor(Math.random() * selectedJury.length)];
    
    // 创建对话框
    const dialogueDiv = document.createElement('div');
    dialogueDiv.className = 'judge-dialogue';
    dialogueDiv.style.top = '150px';
    
    dialogueDiv.innerHTML = `
        <div class="dialogue-content">
            <div class="judge-name">${randomJuror.name}</div>
            "${randomJuror.catchphrase}"
        </div>
    `;
    
    courtroomInner.appendChild(dialogueDiv);
    
    // 4秒后隐藏
    setTimeout(() => {
        dialogueDiv.classList.add('fade-out');
        setTimeout(() => {
            if (courtroomInner.contains(dialogueDiv)) {
                courtroomInner.removeChild(dialogueDiv);
            }
        }, 500);
    }, 4000);
}

// 简单的场景动画
function animateCourtroom() {
    const courtroomInner = container.querySelector('.courtroom-inner');
    
    // 简单的鼠标移动效果
    container.addEventListener('mousemove', (e) => {
        if (!courtroom3DActive) return;
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        courtroomInner.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    
    // 鼠标离开时恢复
    container.addEventListener('mouseleave', () => {
        courtroomInner.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
}

// 调整法庭大小
function adjustCourtroom() {
    if (!container || !courtroom3DActive) return;
    
    // 调整大小与位置
    // 这里可以根据窗口大小调整一些元素的位置
}

// 显示3D法庭
function show3DCourtroom() {
    console.log('显示3D法庭');
    
    // 隐藏常规内容
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('judgment-panel').style.display = 'none';
    
    // 显示3D容器和角色选择界面
    document.getElementById('courtroom-3d').style.display = 'block';
    document.getElementById('character-selection').style.display = 'block';
    
    // 更新导航按钮
    const toChatButton = document.getElementById('to-chat');
    const to3DButton = document.getElementById('to-3d-court'); 
    const backButton = document.getElementById('back-from-3d');
    
    if (toChatButton) toChatButton.style.display = 'none';
    if (to3DButton) to3DButton.style.display = 'none';
    if (backButton) backButton.style.display = 'inline-block';
    
    // 重置角色选择
    selectedJudge = null;
    selectedJury = [];
    
    // 重新初始化角色选择界面
    initCharacterSelection();
}

// 隐藏3D法庭
function hide3DCourtroom() {
    console.log('隐藏3D法庭');
    
    // 隐藏3D容器
    document.getElementById('courtroom-3d').style.display = 'none';
    document.getElementById('character-selection').style.display = 'none';
    
    // 显示常规内容
    document.getElementById('chat-container').style.display = 'flex';
    
    // 更新导航按钮
    const toChatButton = document.getElementById('to-chat');
    const to3DButton = document.getElementById('to-3d-court'); 
    const backButton = document.getElementById('back-from-3d');
    
    if (toChatButton) toChatButton.style.display = 'inline-block';
    if (to3DButton) to3DButton.style.display = 'inline-block';
    if (backButton) backButton.style.display = 'none';
}

// 将3D法庭功能暴露给全局作用域
window.courtroom3D = {
    init,
    show: show3DCourtroom,
    hide: hide3DCourtroom
};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化但不立即显示
    init();
    
    // 添加到渣男鼓点击事件
    const drum = document.getElementById('drum');
    if (drum) {
        drum.addEventListener('click', () => {
            console.log('鼓被点击');
            // 播放鼓声
            const drumSound = document.getElementById('drum-sound');
            if (drumSound) {
                drumSound.currentTime = 0;
                drumSound.play().catch(err => {
                    console.error('播放鼓声失败:', err);
                });
                
                // 10秒后停止声音
                setTimeout(() => {
                    console.log('停止鼓声');
                    drumSound.pause();
                    drumSound.currentTime = 0;
                }, 10000);
            }
            
            // 直接跳转到3D审判庭，2秒后启动
            setTimeout(() => {
                console.log('启动3D渣男审判庭');
                show3DCourtroom();
            }, 2000);
        });
    }
    
    // 移除创建重复按钮的代码，保留按钮事件绑定逻辑
    const to3DButton = document.getElementById('to-3d-court'); 
    const backButton = document.getElementById('back-from-3d');
    
    if (to3DButton) {
        to3DButton.addEventListener('click', () => {
            console.log('点击3D渣男审判庭按钮');
            show3DCourtroom();
        });
    }
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            console.log('点击返回按钮');
            hide3DCourtroom();
        });
    }
});