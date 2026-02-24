import { render as gfmRender } from "@deno/gfm";
import { SmartContent } from './smart-content.ts';
import type { SupportedFormat } from '../file/formats.ts';
import { 格式對應表 } from '../file/formats.ts';

/**
 * 內容渲染器 - 負責各種格式的內容渲染
 */
export class ContentRenderer {
  /**
   * 渲染 Markdown 為 HTML
   */
  public static renderMarkdown(
    markdown: string,
    converters: Record<string, unknown> = {},
  ): string {
    if (!markdown) return "";

    // 處理轉換器（將 [key] 替換為實際值）
    let processedMarkdown = markdown;
    for (const [key, value] of Object.entries(converters)) {
      const regex = new RegExp(`\\[${key}\\]`, "g");
      processedMarkdown = processedMarkdown.replace(regex, String(value));
    }

    return gfmRender(processedMarkdown);
  }

  /**
   * 渲染智慧內容
   */
  public static async render(
    content: SmartContent,
    format: "TEXT" | "HTML" | "MARKDOWN" = "TEXT",
    converters: Record<string, unknown> = {},
  ): Promise<string> {
    await content.fetchAsync();
    const rawContent = content.content;
    const contentType = content.format;

    switch (format) {
      case "HTML":
        return this.renderToHTML(contentType, rawContent, converters);
      case "MARKDOWN":
        return this.renderToMarkdown(contentType, rawContent, converters);
      case "TEXT":
      default:
        return this.renderToText(contentType, rawContent);
    }
  }

  private static renderToHTML(
    format: SupportedFormat,
    content: string | Uint8Array,
    converters: Record<string, unknown> = {},
  ): string {
    if (format === "MARKDOWN" || format === "TEXT") {
      const markdown = this.renderToMarkdown(format, content, converters);
      return this.renderMarkdown(markdown, converters);
    }
    return this.renderBinaryToHTML(format, content);
  }

  private static renderToMarkdown(
    _format: SupportedFormat,
    content: string | Uint8Array,
    converters: Record<string, unknown> = {},
  ): string {
    if (typeof content !== "string") {
      return "";
    }

    let markdown = content;
    // 處理轉換器
    for (const [key, value] of Object.entries(converters)) {
      const regex = new RegExp(`\\[${key}\\]`, "g");
      markdown = markdown.replace(regex, String(value));
    }
    return markdown;
  }

  private static renderToText(
    format: SupportedFormat,
    content: string | Uint8Array,
  ): string {
    return typeof content === "string" ? content : "";
  }

  private static renderBinaryToHTML(
    format: SupportedFormat,
    content: string | Uint8Array,
  ): string {
    const mimeType = 格式對應表[format]?.mime || "application/octet-stream";
    const base64 = typeof content === "string"
      ? content.startsWith("data:") ? content.split(",")[1] : btoa(content)
      : btoa(String.fromCharCode(...new Uint8Array(content)));

    return `<img src="data:${mimeType};base64,${base64}" alt="${format} content" />`;
  }
}
