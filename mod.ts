// Multilingual Object Library
// A comprehensive library for handling multilingual content with intelligent content loading

// Core multilingual classes
export { default as MultilingualObject } from './src/core/base.ts';
export { default as MultilingualString } from './src/implementations/string.ts';
export { default as MultilingualBinary } from './src/implementations/binary.ts';
export { default as MultilingualSmartContent } from './src/implementations/smart-content.ts';

// Smart content utilities
export { SmartContent, ContentRenderer } from './src/utils/content/index.ts';

// Translation services
export { TranslationInterface, DefaultTranslation, registerTranslation, getTranslation, clearTranslation } from './src/core/translation.ts';

// Type definitions and utilities
export type { SupportedLanguage, MultilingualData, SupportedFormat, FileMappingItem } from './src/utils/file/formats.ts';
export { 格式對應表, getFormatFromExt, getFormatFromMime } from './src/utils/file/formats.ts';

// Resource handling
export { ResourceHandler } from './src/utils/file/handler.ts';

// String and array utilities
export { StringUtils, ArrayUtils } from './src/utils/extensions/index.ts';

// Legacy exports (deprecated, will be removed in future versions)
export { default as 多國語言物件 } from './src/core/base.ts';
export { default as 多國語言字串 } from './src/implementations/string.ts';
export { default as 多國語言二進位物件 } from './src/implementations/binary.ts';
export { default as 多國語言智慧內容 } from './src/implementations/smart-content.ts';
export { SmartContent as 智慧內容 } from './src/utils/content/index.ts';
export { ContentRenderer as 內容渲染器 } from './src/utils/content/index.ts';
