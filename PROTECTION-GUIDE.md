# ALMEER BOT — Protection Guide
© 2026 ALMEER / SIDER44 · github.com/SIDER44

---

## What's included in this protection system

| File | Purpose |
|------|---------|
| `LICENSE` | Legal copyright — prohibits redistribution & rebranding |
| `lib/brandlock.js` | Runtime brand enforcer — detects & kills unauthorized copies |
| `build-protected.js` | Obfuscation build script — makes code unreadable |
| All `.js` files | © copyright header added to every file |

---

## Layer 1 — Legal (LICENSE)

The LICENSE file clearly prohibits:
- Redistribution of source code
- Rebranding under another name
- Removing ALMEER credits

This gives you legal grounds to file DMCA takedowns on GitHub if someone
publishes your bot under their own name.

---

## Layer 2 — Runtime Brand Lock (lib/brandlock.js)

Already integrated into `index.js`. At every startup it:

1. Prints the ALMEER ASCII banner to Railway logs (proof of origin)
2. Checks if `BOT_NAME` env var contains "ALMEER"
3. If someone removes it → sends a WhatsApp alert to the real owner JID,
   then **kills the process** after 3 seconds

---

## Layer 3 — Code Obfuscation (build-protected.js)

This converts your readable source into something like this:

```
var _0x3f2a=['ALMEER',0x4b2,function(_0x1a){return _0x1a}...
```

**Nobody can read, edit, or rebrand obfuscated code.**

### How to build:

```bash
# One-time setup (install the obfuscator)
npm install javascript-obfuscator --save-dev

# Build obfuscated version into ./dist/
node build-protected.js
```

### Deploy dist/ to Railway (not the source):

In Railway, set your root directory to `dist/` OR zip up `dist/` and
push that to GitHub instead of your source repo.

---

## What to NEVER publish publicly

- `index.js` (source)
- `plugins/` (source)  
- `lib/` (source)

Only publish/deploy the `dist/` folder after running the build.

---

## Recommended workflow

1. Develop normally in the source folder
2. Run `node build-protected.js` before each deploy
3. Push only the `dist/` folder to your Railway-connected GitHub repo
4. Keep your real source in a **private** GitHub repo

---

## If someone steals your bot anyway

1. File a DMCA takedown on GitHub using the LICENSE as evidence
2. The brand lock will alert you via WhatsApp when an unauthorized
   copy connects — you'll get their number
3. Report to Railway/hosting provider using the copyright notice

