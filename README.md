# yitumulin

个人网站（静态站点）。首页为极简个人主页，包含导航、粒子动效背景、暗黑模式切换；其余页面涵盖 About、Posts、Archives、Search、Contact 等内容。

- 在线地址：`https://yitumulin.com`（见仓库根目录 `CNAME`）
- 技术栈：原生 HTML + CSS + JavaScript（无框架依赖）

---

## 功能特性

- 暗黑模式切换：记忆用户选择，自动适配系统偏好（`darkmode.js`）。
- 页面转场与动画：导航 hover 下划线、卡片浮动、渐显等（`style.css`、`js/transitions.js`）。
- 首页粒子背景：基于 `particles.js`，全屏动态点线背景（`index.html`）。
- 站内搜索：使用 `Lunr.js` 在前端构建索引并检索（`search.html`、`search.js`、`search-data.json`）。
- 响应式样式：移动端优化，导航与卡片在小屏良好展示（`style.css`）。

---

## 站点结构

- `index.html` 首页，展示头像、站点标题、社交链接与快捷按钮。
- `about.html` 个人简介与偏好内容卡片。
- `posts.html` 文章列表（链接到 `posts/` 下的文章页面）。
- `archives.html` 归档列表。
- `search.html` 站内搜索页（依赖 `search.js` 与 `search-data.json`）。
- `contact.html` 联系方式（Email、Telegram、WeChat）。
- `posts/` 文章目录（示例：`posts/project1.html`）。
- 静态资源：`style.css`、`js/transitions.js`、`avatar.png`、`favicon.png` 等。
- 自定义域名：`CNAME` 指向 `yitumulin.com`。

---

## 本地预览

方法一：直接打开
- 双击 `index.html` 用浏览器打开即可（多数功能可用，搜索可能受浏览器本地跨域限制）。

方法二：启动简易本地服务器（推荐）
- Python 3：`python -m http.server 8000`，然后访问 `http://localhost:8000`
- Node（http-server）：`npx http-server -p 8000`，然后访问 `http://localhost:8000`

---

## 新增或更新内容

新增文章
- 在 `posts/` 下新增 `your-post.html`
- 在 `posts.html` 中的列表加入一条链接与日期
- 可在 `archives.html` 中同步加入归档条目（如需）
- 在 `search-data.json` 中加入搜索索引项（示例字段：`id`、`title`、`content`、`url`、`date`）以便被 `Lunr.js` 检索

更新站点导航或样式
- 导航在各页面的 `<nav class="site-nav">` 段内统一维护
- 主题色、字体与常用变量集中在 `style.css` 顶部变量区，可整体调整

搜索数据维护
- `search-data.json` 是前端索引数据来源，新增页面后手动更新此文件，`search.js` 会自动构建索引

---

## 部署

- GitHub Pages 建议模式：将仓库 `main` 分支作为 Pages 来源（已配置 `CNAME` 指向 `yitumulin.com`）
- 自定义域名：确保 DNS CNAME 指向 `username.github.io`，且仓库保留根目录 `CNAME`

---

## 备注

- 站点内包含 Microsoft Clarity 统计代码片段（`index.html` `<head>` 中），如不需要可移除对应脚本。
- 本仓库已移除「AI Chat」相关页面与文档，导航中不再展示。
