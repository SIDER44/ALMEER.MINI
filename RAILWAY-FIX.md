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
