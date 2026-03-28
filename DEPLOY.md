# 打包与部署说明

本项目为 **Vite + Vue 3** 单页应用，静态资源输出到 `dist/`。线上默认通过 **GitHub Actions** 推送到 **GitHub Pages**。

---

## 一、本地开发与打包

### 环境要求

- **Node.js**：建议 **20.x**（与 CI 一致）
- **npm**：随 Node 安装即可

### 常用命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖（首次或依赖变更后） |
| `npm run dev` | 本地开发，默认 `http://localhost:5173` |
| `npm run build` | 生产构建，产物在 `dist/` |
| `npm run preview` | 本地预览构建结果（需先 `build`） |

### 构建产物

- 执行 `npm run build` 后，静态文件位于 **`dist/`** 目录。
- 可将 `dist/` 内全部文件上传到任意静态托管（Nginx、OSS、其他 Pages 等）。

---

## 二、资源路径（`base`）说明

`vite.config.js` 中配置了：

```js
base: '/frontendTools/',
```

含义：

- 站点部署在 **子路径** `https://<用户名>.github.io/frontendTools/`（或等价路径）时，资源链接才会正确。
- 若改为部署在 **根路径**（例如用户站点 `https://<用户名>.github.io/`），需把 `base` 改为 `'/'` 或 `'./'` 后重新构建。

修改 `base` 后务必重新执行 `npm run build` 再部署。

---

## 三、GitHub Pages 自动部署（当前仓库方式）

工作流文件：`.github/workflows/deploy-pages.yml`。

### 触发条件

- 向分支 **`master`** **push** 时自动执行。

### 流程简述

1. **checkout** 拉取代码  
2. **Setup Node 20**，并启用 npm 缓存  
3. **`npm ci`** 安装依赖（需存在 `package-lock.json`）  
4. **`npm run build`** 执行 Vite 构建  
5. 将 **`dist/`** 作为静态站点产物上传  
6. 使用 **`actions/deploy-pages`** 发布到 GitHub Pages  

### 首次使用前（仓库设置）

1. 打开 GitHub 仓库 → **Settings** → **Pages**  
2. **Build and deployment** 中 **Source** 选择 **GitHub Actions**（不要再用 “Deploy from a branch” 的旧方式，除非你知道区别）  
3. 保存后，推送一次到 `master` 触发工作流  

### 访问地址

- 一般为：`https://<你的用户名>.github.io/<仓库名>/`  
- 具体以仓库 **Settings → Pages** 里显示的 URL 为准；需与 `vite.config.js` 里的 `base` 一致。

### 失败排查

- **Actions** 标签页打开对应运行记录，查看 **build** 步骤日志（依赖安装、构建报错等）。  
- 常见原因：Node 版本与本地不一致导致的问题、`npm ci` 与 lock 不同步、构建命令失败。

---

## 四、仅本地打包后手动上传（可选）

不通过 GitHub Actions 时：

1. 本地执行：`npm ci`（或 `npm install`）→ `npm run build`  
2. 将 **`dist/` 目录下所有文件** 上传到目标静态服务器的网站根目录（或与你配置的 `base` 对应的子目录）  
3. 若服务器子路径与当前 `base` 不一致，先改 `vite.config.js` 的 `base` 再重新构建  

---

## 五、简要流程图

```
本地开发: npm run dev
     ↓
提交并 push 到 master
     ↓
GitHub Actions: npm ci → npm run build → 上传 dist
     ↓
GitHub Pages 发布
     ↓
浏览器访问（路径需与 base 一致）
```

---

如有更换仓库名、自定义域名或改用根域名部署，请先调整 **`vite.config.js` 的 `base`**，再按上述流程重新构建与部署。
