#!/bin/sh
# 启动脚本 - 处理信号和优雅关闭

# 输出颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "${GREEN}正在启动渣男公审大会应用...${NC}"

# 检查环境变量
if [ -z "$DEEPSEEK_API_KEY" ]; then
  if [ -f ".env" ]; then
    echo "${YELLOW}从.env文件加载环境变量${NC}"
    export $(grep -v '^#' .env | xargs)
  else
    echo "${RED}警告: 未找到DEEPSEEK_API_KEY环境变量或.env文件${NC}"
    echo "${YELLOW}应用可能无法正常工作${NC}"
  fi
fi

# 存储进程ID
NODE_PID=""

# 信号处理函数
handle_signal() {
  echo "${YELLOW}接收到信号，正在优雅关闭...${NC}"
  if [ -n "$NODE_PID" ]; then
    echo "${YELLOW}发送SIGTERM到Node.js进程 (PID: $NODE_PID)${NC}"
    kill -TERM "$NODE_PID"
    wait "$NODE_PID"
  fi
  echo "${GREEN}应用已安全关闭${NC}"
  exit 0
}

# 设置信号处理
trap handle_signal SIGINT SIGTERM

# 启动Node.js应用
echo "${GREEN}启动Node.js应用 (server.js)${NC}"
node server.js &
NODE_PID=$!

# 等待进程完成
wait $NODE_PID
