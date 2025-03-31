# 基础镜像为Node.js 18
FROM node:18-alpine

# 创建工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖（使用淘宝npm镜像源）
RUN npm config set registry https://registry.npmmirror.com \
    && npm install

# 复制项目文件到工作目录
COPY . .

# 确保webpack可执行并构建前端应用（使用淘宝镜像源）
RUN npm config set registry https://registry.npmmirror.com \
    && npm install -g webpack webpack-cli \
    && npm run build

# 设置启动脚本权限
RUN chmod +x ./start.sh

# 开放容器的4000端口
EXPOSE 4000

# 使用启动脚本而不是直接运行node
CMD ["./start.sh"]