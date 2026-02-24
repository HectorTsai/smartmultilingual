# SmartMultilingual

一個智慧的多語言內容庫，用於處理多語言內容，並具備智慧內容載入功能。

## 功能

- **多國語言物件**：支援多語言字串、二進位物件和智慧內容。
- **智慧內容載入**：根據內容自動擷取檔案或遠端資料。
- **翻譯服務**：提供註冊和獲取翻譯服務的介面。
- **資源處理**：處理不同格式的檔案資源。

## 安裝

使用 Deno：

```bash
deno add @dui/smartmultilingual
```

## 用法

```typescript
import { MultilingualString, SmartContent } from "@dui/smartmultilingual";

// 創建多國語言字串
const str = new MultilingualString({
  en: "Hello",
  "zh-tw": "你好"
});

// 獲取特定語言
console.log(str.get("zh-tw")); // 輸出：你好

// 使用智慧內容
const content = new SmartContent("path/to/content.md");
await content.load(); // 自動載入內容
```

## 開發

### 測試

```bash
deno task test
```

### 開發模式

```bash
deno task dev
```

## 貢獻

歡迎提交 Issue 和 Pull Request！

## 許可證

MIT
