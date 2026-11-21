# Railway build fix (npm ci failure)
package-lock.json pointed all 180 packages at a private registry (europe-west4-npm.pkg.dev ... sandbox-npm-cache) that
Railway cannot reach, and libsignal at git+ssh://git@github.com (needs an SSH key). The lockfile was regenerated from
registry.npmjs.org and libsignal now uses git+https. Verified: `npm ci` and `npm run build` both succeed from a clean folder.
