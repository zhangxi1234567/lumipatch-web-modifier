# LumiPatch Web Modifier

A Chrome extension for AI-assisted webpage customization. Right-click any element, describe your change, preview instantly, and save it as persistent site rules.

中文说明：这是一个用于网页“所见即改”的 Chrome 扩展，右键选中即可让 AI 修改并永久保存。

## Product Name Suggestion

**LumiPatch**

Why this name:
- `Lumi` = light, visual design, theme styling
- `Patch` = precise, targeted modification on existing pages

中文说明：`LumiPatch` 表达“视觉美化 + 精准修改”的核心能力，简短、好记、适合产品化。

## Core Workflow

1. Open any `http` or `https` page.
2. Right-click a target element, or use lasso selection (`圈选目标 / 画圈`).
3. Enter what you want to change.
4. Click `直接修改` for instant preview.
5. Click `永久保存` to persist rules for the current site.

中文说明：流程是“选中 -> 描述需求 -> 预览 -> 永久保存”。

## Main Capabilities

- Inline AI editor opened from right-click
- Targeted editing for text, style, and structure
- Theme template system with search/filter
- Component template system for quick replacement
- Drag-to-reposition live DOM elements
- Rule persistence per hostname
- Rule history, merge, import, export, undo/redo support

中文说明：支持局部 AI 改写、模板替换、拖拽布局、站点级规则持久化与历史管理。

## Scope and Limitations

Works on normal webpages only.

Not supported by Chrome content-script policy:
- `chrome://extensions`
- `chrome://settings`
- Chrome Web Store pages

中文说明：只能在普通网页上运行，Chrome 内置页面无法注入脚本。

## Load in Chrome

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select this project folder
5. Open extension settings and configure `baseUrl`, `apiKey`, `model`

中文说明：开发者模式下以“加载已解压扩展”的方式安装。

## Settings

Key settings include:
- `workspaceName`
- `baseUrl`
- `apiKey`
- `model`
- `maxTokens`
- `systemPrompt`
- `pageBodyMaxChars`
- `autoPreviewGeneratedRules`
- `enableMutationObserver`

中文说明：可自行配置 AI 服务地址、密钥、模型和上下文策略。

## Rule Types

Supported rule types:
- `style`
- `hide`
- `setText`
- `textReplace`
- `attribute`
- `customCss`
- `moveNode`
- `pinNode`
- `pagePinNode`
- `replaceNode`

中文说明：规则系统覆盖样式、文本、属性、布局移动、节点替换等主流修改场景。

## Project Structure

- `manifest.json`
- `extension/background.js`
- `extension/content-script.js`
- `extension/options.html`
- `extension/options.js`
- `extension/lib/`
- `tests/`

中文说明：核心逻辑在 `content-script.js`，配置页在 `options.*`，规则和请求逻辑在 `extension/lib/`。

## Development

Install dependencies and run tests:

```bash
npm install
npm test
```

Current baseline: all tests should pass.

中文说明：提交前建议跑完整测试，确保扩展行为稳定。
