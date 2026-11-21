# Railway build fix (npm ci failure)
package-lock.json pointed all 180 packages at a private registry (europe-west4-npm.pkg.dev ... sandbox-npm-cache) that
Railway cannot reach, and libsignal at git+ssh://git@github.com (needs an SSH key). The lockfile was regenerated from
registry.npmjs.org and libsignal now uses git+https. Verified: `npm ci` and `npm run build` both succeed from a clean folder.

# Pairing fix (v2)
* Linked-device identity is now permanently Google Chrome on Ubuntu (`BROWSER` in index.js).
* RIOT-style pairing: one code per socket (pressing generate twice returns the same code), waits for the socket to be ready with retries,
  abandons a code request if that socket dies, fresh socket + fresh code every time.
* No more blocking on a terminal prompt on Railway (it used to wait on `Enter WhatsApp number` forever).
* A rejected pairing socket (401) or a logout now restarts cleanly for a new pairing; before, the process exited with code 0, which Railway does not restart.
* Reconnect after pairing succeeds (515) is a fast 3s retry.
* `plugins/fun/8ball.js` syntax error fixed (all 89 plugins load now).
* Optional: add a Railway Volume at /data and set AUTH_DIR=/data/auth_info so the session survives redeploys.

# v3: duplicate-instance guard + retry fix
* getMessage returns undefined for unknown messages (an empty message left the phone on "Waiting for this message").
* Heartbeat lock in AUTH_DIR: a second copy of the bot on the same session waits, and an old one shuts itself down, so commands are answered once. Several "Waiting for this message" entries after every command usually means several copies are replying.

# v4: Baileys 6.7.23 -> 7.0.0-rc14 (same as RIOT)
* ALMEER was pinned to the legacy 6.x line (^6.7.9) although its own code already uses 7.x LID APIs (signalRepository.lidMapping, participantAlt). 6.x does not handle WhatsApp's LID addressing, which shows up as "Waiting for this message" on the phone for everything the bot sends.
* package.json now pins 7.0.0-rc14; lockfile regenerated (no git/ssh dependency any more).
* Owner check now matches both the phone-number JID and the LID.
* Link previews off (faster replies).
* After deploying: unlink old devices in WhatsApp, delete auth_info (or use a new AUTH_DIR), pair once.
