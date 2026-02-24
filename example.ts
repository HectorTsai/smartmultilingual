import { 
  多國語言字串, 
  registerTranslationService, 
  TranslationService 
} from "./mod.ts";

// 自訂翻譯服務範例
class MyTranslationService implements TranslationService {
  translate(
    from: string,
    to: string,
    text: string,
    _host?: string
  ): Promise<string> {
    console.log(`翻譯 ${from} -> ${to}: ${text}`);
    
    // 簡單的模擬翻譯
    if (from === to) return text;
    return `[${to}] ${text}`;
  }
}

async function main() {
  // 註冊自訂翻譯服務
  registerTranslationService(new MyTranslationService());
  
  // 建立多國語言字串
  const mlString = new 多國語言字串({
    "en": "Hello World",
    "zh-tw": "你好世界",
    "ja": "こんにちは世界",
    "ko": "안녕하세요 세계"
  } as 多國語言資料<string>);
  
  console.log("英文:", mlString["en"]);
  console.log("中文:", mlString["zh-tw"]);
  
  // 翻譯成日文
  const japaneseText = await mlString.toStringAsync("ja");
  console.log("日文翻譯:", japaneseText);
}

if (import.meta.main) {
  main().catch(console.error);
}
