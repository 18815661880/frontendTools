# GitHub Pages 部署静态站点完整流程

适用于本仓库（Vite + Vue）的 GitHub Pages 部署。

---

## 一、前置条件

- 代码已推送到 GitHub 仓库
- 仓库为 Public，或你的账号有 GitHub Pages 权限

---

## 二、在 GitHub 启用 Pages 并选源

1. 打开仓库 → **Settings** → 左侧 **Pages**。
2. **Build and deployment**：
   - **Source** 选 **GitHub Actions**（不要选 “Deploy from a branch”）。
3. 保存（无需其他操作，workflow 会负责构建与发布）。

---

## 三、自动部署（已配置）

仓库已包含 workflow：`.github/workflows/deploy-pages.yml`。

- **触发**：向 `master` 分支 push 时自动执行。
- **流程**：安装依赖 → `npm run build` → 将 `dist` 上传为 Pages 产物 → 部署到 GitHub Pages。

你只需：

```bash
git add .
git commit -m "feat: update site"
git push origin master
```

首次运行后，到 **Actions** 页查看是否成功；约 1–2 分钟后访问站点。

---

## 四、站点地址

- **项目站点**（当前配置）：  
  `https://<你的用户名>.github.io/frontendTools-gitHub/`  
  注意末尾斜杠，且 `vite.config.js` 中 `base` 必须为 `'/frontendTools-gitHub/'`（已配置）。

- **用户/组织站点**（仓库名为 `用户名.github.io`）：  
  地址为 `https://<用户名>.github.io/`。  
  需把 `vite.config.js` 里 `base` 改为 `'/'` 或 `'./'`，然后重新 push 触发部署。

---

## 五、本地验证构建

```bash
npm ci
npm run build
npm run preview
```

浏览器打开 `preview` 提示的地址，确认资源路径、路由正常后再 push。

---

## 六、常见问题

| 现象 | 处理 |
|------|------|
| 页面空白或 404 | 检查 `base` 是否与 Pages 路径一致（项目站为 `/仓库名/`） |
| CSS/JS 404 | 同上；确保 `base` 末尾有 `/` |
| 部署未触发 | 确认 push 的是 `master`；到 **Settings → Pages** 确认 Source 为 **GitHub Actions** |
| 想用其他分支 | 编辑 `.github/workflows/deploy-pages.yml` 中 `branches: [master]` 为所需分支名 |

---

## 七、可选：自定义域名

1. **Settings → Pages** 中 **Custom domain** 填你的域名并保存。
2. 在域名 DNS 增加 CNAME 记录指向 `<用户名>.github.io`（或按 GitHub 提示配置）。
3. 若用根域名，在仓库根目录添加无后缀文件 `CNAME`，内容为你的域名。

使用自定义域名且站点在根路径时，记得将 `base` 改为 `'/'` 后重新构建部署。
