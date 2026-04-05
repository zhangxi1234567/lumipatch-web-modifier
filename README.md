# LumiPatch Web Modifier

A Chrome extension for AI-assisted webpage customization. Right-click any element, describe your change, preview instantly, and save it as persistent site rules.

中文说明：这是一个用于网页“所见即改”的 Chrome 扩展，右键选中即可让 AI 修改并永久保存。

## Product Name

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

## Feature Breakdown

### 1) AI Targeted Editing

- Inline AI editor opens directly from right-click.
- Supports click-target and freehand lasso-target.
- Can modify text, style, attributes, and structure.
- Supports focused edits on selected target and whole-page style mode.
- Preview first, then persist with one click.

中文说明：支持“指哪改哪”的局部 AI 修改，也支持整页风格改造，先预览后保存。

### 2) Theme Templates (Background and Color)

- Built-in theme templates for quick page restyling.
- Search by template name or ID.
- Filter by light/dark tone.
- One-click preview and save.
- Saved theme rules auto-apply after refresh.

中文说明：支持背景和配色模板的一键切换、搜索筛选、预览保存，并可刷新后自动恢复。

### 3) Component Templates (UI Replacement)

- Built-in component templates for button/input/card/badge/select.
- Search and category filtering.
- Apply scope options:
  - only current selected target
  - all similar elements on page
- Preview before save.

中文说明：支持组件级一键替换，既可只改选中目标，也可批量改页面同类组件。

### 4) Drag Layout Editing (Major Feature)

- Enable drag mode to reposition real live DOM elements.
- Dragged elements remain interactive after drop (buttons still clickable, inputs still editable).
- Original location keeps a placeholder to avoid layout collapse.
- Drop position is preserved exactly where released.
- Drag results can be persisted and reloaded after refresh.
- Click suppression prevents accidental click actions at drag end.
- Supports cross-container reflow and pin/follow-page persistence modes.

中文说明：拖拽是核心能力。拖的是“活元素”，不是截图。拖完可永久保存，刷新后不丢，且有占位和防误触机制，支持跨容器重排与固定/跟随页面模式。

### 5) Rules and Persistence

- Per-hostname rule storage.
- Incremental rule merge for repeated edits.
- Rule history support with undo/redo.
- Export/import for migration and backup.

中文说明：规则按站点保存，多次修改自动合并，并支持历史管理、导入导出。

### 6) Stability and Compatibility

- Injects into top document and related frames/iframes when possible.
- Optional mutation observer to re-apply rules on dynamic DOM updates.
- Test suite covers core generation, storage, panel, and rule application paths.

中文说明：兼顾复杂页面兼容与稳定性，支持动态 DOM 场景下持续生效。

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
