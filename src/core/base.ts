import { SUPPORTED_LANGUAGE_SET } from './types.ts';
import type { SupportedLanguage, MultilingualData } from './types.ts';

interface MultilingualIndex<T> {
  [key: string]: T | undefined;
}

export default class MultilingualObject<T> {
  private _data: Record<string, T | undefined> = {};

  protected constructor(data?: MultilingualData<T>) {
    if (data) {
      for (const [lang, value] of Object.entries(data)) {
        if (SUPPORTED_LANGUAGE_SET.has(lang as SupportedLanguage)) {
          this._data[lang] = value;
        }
      }
    }
  }

  public getItem(key: string): T | undefined {
    return this._data[key];
  }

  public setItem(key: string, value: T | undefined): void {
    if (SUPPORTED_LANGUAGE_SET.has(key as SupportedLanguage)) {
      this._data[key] = value;
    }
  }

  /** 檢查是否有指定語言的內容 */
  public has(lang: SupportedLanguage): boolean {
    return !!this._data[lang];
  }

  public delete(lang: SupportedLanguage): boolean {
    const hasKey = !!this._data[lang];
    delete this._data[lang];
    return hasKey;
  }

  /** 取得所有可用的語言 */
  public getAllAvailableLanguages(): SupportedLanguage[] {
    return Object.keys(this._data).filter(
      (key) => SUPPORTED_LANGUAGE_SET.has(key as SupportedLanguage)
    ) as SupportedLanguage[];
  }

  /** 取得第一個可用的語言 */
  public getFirstAvailableLanguage(): SupportedLanguage | null {
    const available = this.getAllAvailableLanguages();
    return available.length > 0 ? available[0] : null;
  }

  /** 尋找最佳的來源語言 */
  public findBestSourceLanguage(preferredLang?: SupportedLanguage): SupportedLanguage | null {
    // 優先順序：指定語言 > 英文 > 中文繁體 > 第一個可用語言
    if (preferredLang && this.has(preferredLang)) return preferredLang;
    if (this.has("en")) return "en";
    if (this.has("zh-tw")) return "zh-tw";
    return this.getFirstAvailableLanguage();
  }

  /**
   * 轉換為純物件
   * @param languageSet 指定要轉換的語言集合，如果未指定則轉換所有支援的語言
   * @returns 純物件，包含指定語言的多國語言資料的 JSON 表示
   */
  public toJSON(languageSet?: SupportedLanguage[]): MultilingualData<T> {
    const result: Record<string, T> = {} as MultilingualData<T>;
    
    for (const lang of (languageSet || this.getAllAvailableLanguages())) {
      const data = this._data[lang];
      if (data !== undefined) {
        result[lang] = data;
      }
    }
    
    return result as MultilingualData<T>;
  }

  /**
   * 轉換為字串表示
   * @returns JSON 字串表示
   */
  public toString(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * 克隆物件
   * @returns 新的多國語言物件實例
   */
  public clone(): MultilingualObject<T> {
    return new MultilingualObject<T>(this.toJSON());
  }

  /**
   * 檢查對象是否為多國語言物件實例
   */
  public static is<T>(obj: unknown): obj is MultilingualObject<T> {
    return obj instanceof MultilingualObject;
  }

  /**
   * 合併其他多國語言物件
   */
  public static merge = <T>(
    ...objects: Array<MultilingualObject<T>>
  ): MultilingualObject<T> => {
    const merged = new MultilingualObject<T>();
    for (const obj of objects) {
      for (const lang of obj.getAllAvailableLanguages()) {
        merged._data[lang] = obj._data[lang];
      }
    }
    return merged;
  };

  /**
   * 受保護的翻譯方法
   */
  protected async translate(
    host: string,
    from: SupportedLanguage,
    to: SupportedLanguage,
    text: string,
  ): Promise<string> {
    try {
      // 動態導入翻譯服務
      const { getTranslation } = await import('./translation.ts');
      const translationService = getTranslation();
      return await translationService.translate(from, to, text, host);
    } catch (e: unknown) {
      console.error(`[MultilingualObject] 翻譯失敗 ${from} -> ${to}: ${text} => Fail`);
      console.log(e);
      return text;
    }
  }
}
