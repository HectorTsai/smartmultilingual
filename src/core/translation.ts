/**
 * 翻譯服務介面
 * 讓使用者可以自行注入翻譯實作
 */
export interface TranslationInterface {
  /**
   * 執行翻譯
   * @param from 來源語言
   * @param to 目標語言
   * @param text 要翻譯的文字
   * @param host 主機位址（可選，取決於具體實作）
   * @returns 翻譯後的文字
   */
  translate(
    from: string,
    to: string,
    text: string,
    host?: string
  ): Promise<string>;
}

/**
 * 預設的翻譯服務實作
 * 使用 fetch 呼叫 API 端點
 */
export class DefaultTranslation implements TranslationInterface {
  async translate(
    from: string,
    to: string,
    text: string,
    _host?: string
  ): Promise<string> {
    try {
      const url = encodeURI(
        `/api/語言/翻譯?from=${from}&to=${to}&text=${text}`
      );
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.translated;
      }
      return text;
    } catch (error) {
      console.error(`[DefaultTranslation] 翻譯失敗 ${from} -> ${to}: ${text}`, error);
      return text;
    }
  }
}

/**
 * 全域翻譯服務註冊器
 */
let globalTranslationService: TranslationInterface | null = null;

/**
 * 註冊翻譯服務
 * @param service 翻譯服務實例
 */
export function registerTranslation(service: TranslationInterface): void {
  globalTranslationService = service;
}

/**
 * 取得已註冊的翻譯服務
 * @returns 翻譯服務實例，如果未註冊則返回預設服務
 */
export function getTranslation(): TranslationInterface {
  return globalTranslationService || new DefaultTranslation();
}

/**
 * 清除已註冊的翻譯服務
 */
export function clearTranslation(): void {
  globalTranslationService = null;
}
