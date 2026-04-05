# ERRORS.md

## [ERR-20260329-001] apply_patch_patch_format

**Logged**: 2026-03-29T00:00:00+08:00
**Priority**: low
**Status**: pending
**Area**: tests

### Summary
An apply_patch command failed because the patch body was malformed and missing the end marker.

### Error
```
Invalid patch: The last line of the patch must be '*** End Patch'
```

### Context
- Command attempted: apply_patch for `tests/panel-ui.test.js`
- Environment details: exec-command shell patch flow

### Suggested Fix
Re-run the patch with a complete `*** End Patch` terminator.

### Metadata
- Reproducible: yes
- Related Files: tests/panel-ui.test.js

---
## [ERR-20260331-001] local-test-runtime-missing

**Logged**: 2026-03-31T00:00:00+08:00
**Priority**: medium
**Status**: pending
**Area**: tests

### Summary
The local execution environment for this task does not provide `node` or `npm`, so the extension's test suite cannot be run here.

### Error
```
/bin/bash: line 1: npm: command not found
/bin/bash: line 1: node: command not found
```

### Context
- Command attempted: `npm test`
- Fallback attempted: `node --test`
- Environment details: current Codex CLI shell session in `/mnt/c/Users/21604/Desktop/谷歌 (2)/谷歌`

### Suggested Fix
Use an environment with Node.js installed before relying on automated test execution for this repository.

### Metadata
- Reproducible: yes
- Related Files: package.json, tests/panel-ui.test.js

---
## [ERR-20260331-002] shell_quote_mismatch

**Logged**: 2026-03-31T00:00:00+08:00
**Priority**: low
**Status**: pending
**Area**: docs

### Summary
A composite shell command failed because nested quotes in an `rg` pattern were not escaped correctly.

### Error
```
/bin/bash: -c: line 1: unexpected EOF while looking for matching '"'
/bin/bash: -c: line 2: syntax error: unexpected end of file
```

### Context
- Command attempted: combined `rg` + `sed` read for `extension/background.js`
- Environment details: current Codex CLI shell session in `/mnt/c/Users/21604/Desktop/谷歌 (2)/谷歌`

### Suggested Fix
Prefer single-quoted shell strings around `rg` patterns or split the inspection into separate commands when the pattern itself contains quotes.

### Metadata
- Reproducible: yes
- Related Files: extension/background.js

---
