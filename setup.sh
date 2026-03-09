#!/bin/bash

# 1. Python 环境：创建并升级
[ ! -d "venv" ] && python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip --quiet

# 2. 安装依赖：优先检测根目录
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt --quiet
elif [ -f "src/requirements.txt" ]; then
    pip install -r src/requirements.txt --quiet
fi

# 3. 前端环境：检测并安装
[ -f "package.json" ] && npm install

echo "✅ 环境就绪。请执行: source venv/bin/activate"