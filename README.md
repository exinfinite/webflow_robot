# Webflow output for Netlify 自動化專案範本

## 安裝套件

```js
npm install
```
<br>

## 自動清理檔案

### 將Webflow輸出的zip放置在根目錄

### 修改gulpfile.js的config

### 執行指令

```js
npm run build
```

### 將public資料夾發布至Netlify

<br>

## 預覽&部署

### 全域安裝netlify cli

```js
npm install netlify-cli –g
```

### 初始化Netlify設定

```js
netlify init
```

### 預覽

```js
//本機預覽
npm run local_preview
//部署預覽
npm run deploy_preview
```

### 部署

```js
//部署但不發佈
npm run deploy
//正式部署並發佈
npm run deploy_prod
```