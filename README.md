# 华衿 · 汉服租赁平台

一个汉服租赁一体化平台，为汉服爱好者提供在线租衣、智能搭配推荐与汉服文化百科，为商家与平台运营方提供商品、订单、门店、会员及权限的完整后台管理。基于 `@umijs/max` 的前后台 Monorepo 项目，使用 pnpm workspace 管理。

## 功能概览

### 用户端 Web（端口 8000）

- **寻衣**：浏览汉服租赁商品，按形制、朝代等维度挑选，查看商品详情
- **量体裁案**：智能搭配推荐——按穿着场景、气韵风格、租期档期三步问答，匹配合适的汉服
- **风物志**：汉服文化百科，按朝代（先秦两汉、大唐气象等）梳理各代形制词条
- **市集**：汉服周边商城
- **租赁下单**：支持按天/按周计租，含押金、洗涤费、最小/最大租期限制，可选具体衣件（尺码 + 成色：全新/良好/微瑕）
- **我的订单 / 个人中心**：订单跟踪与个人信息管理

### 管理后台 Admin（端口 8002）

- **仪表盘**：管理员/门店两种视角的数据概览与图表
- **商品管理**：商品列表、SKU 管理（尺码、成色等级）
- **订单管理**：订单列表、发货处理
- **会员管理**：会员列表、入驻审核
- **门店管理**：门店信息维护
- **系统管理**：用户、角色、菜单、字典（RBAC 权限体系）

## 技术栈

- **框架**：Umi Max（`@umijs/max`）+ React 18 + TypeScript
- **UI**：Ant Design 5 + Ant Design Pro Components
- **图表**：ECharts（Admin 端）
- **工程化**：pnpm workspace、Husky、lint-staged、Prettier

## 项目结构

```
packages
├── web      # 用户端（端口 8000）：首页、购买、我的订单、个人中心
├── admin    # 管理后台（端口 8002）：仪表盘、会员、订单、商品、门店、系统管理
└── shared   # 共享包：公共组件、请求封装、类型定义、工具函数、后端地址配置
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev          # 启动用户端 web（http://localhost:8000）
pnpm dev:admin    # 启动管理后台 admin（http://localhost:8002）
pnpm dev:all      # 同时启动 web 和 admin
```

### 构建

```bash
pnpm build        # 构建所有 packages
```

### 代码格式化

```bash
pnpm format       # Prettier 格式化
```

## 后端地址配置

后端地址在 `packages/shared/src/backendAddress.ts` 中配置，通过 `isCloud` 开关切换云端地址与本地地址（`http://localhost:8080`）。

## 相关文档

- [Umi Max 简介](https://umijs.org/docs/max/introduce)
- [Ant Design 组件文档](https://ant.design/components/overview-cn)
- [pnpm workspace 文档](https://pnpm.io/zh/workspaces)
