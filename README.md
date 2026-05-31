# ALMEER MINI

Cyberpunk WhatsApp bot built with [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys).
No owner number env needed — owner is auto-detected from session creds.

## Quick start

```bash
npm install
npm start
```

Open `http://localhost:3000`, unlock with the password (default `almeer`,
change via `WEB_PASSWORD` env), enter your WhatsApp number in international
format (no `+`), and paste the pairing code into WhatsApp →
Linked Devices → Link with phone number.

If no web port is available (some Pterodactyl eggs), the bot falls back to a
terminal prompt asking for your number.

## Default features (all ON, toggle individually)

| Feature             | Description                                              |
|---------------------|----------------------------------------------------------|
| `autoViewStatus`    | Auto-read incoming status updates                        |
| `autoReactStatus`   | Auto-react to statuses with configurable emoji           |
| `statusEmojiChanger`| Owner sets react emoji via `.setemoji [emoji]`           |
| `antiDeleteStatus`  | Forwards deleted statuses to owner DM                    |
| `antiDelete`        | Forwards deleted DM / group messages to owner DM         |
| `antiEdit`          | Sends original + edited version to owner DM              |
| `viewOnceUnlock`    | React to a view-once with any emoji → bot sends to DM    |

## Owner commands

- `.help` — command menu
- `.settings` — show all toggles
- `.toggle [feature]` — flip a toggle
- `.setemoji [emoji]` — change status react emoji (default ❄️)
- `.status` — uptime & linked number

## Deploy

- **Railway** — push the repo; `railway.json` sets NIXPACKS + ON_FAILURE.
- **Pterodactyl** — Node.js 20 egg, startup `node index.js`.
- **VPS** — `pm2 start index.js --name almeer-mini`.

Session is stored in `auth_info/`, settings in `data/settings.json`.
