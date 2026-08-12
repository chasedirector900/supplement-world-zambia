/**
 * Production build that won't break a running dev server.
 *
 * `next build` writes into the same directory `next dev` serves from, so
 * building while `npm run dev` is up strips the dev CSS/JS chunks and the app
 * renders completely unstyled until the dev server is restarted. This points
 * the build at `.next-build` instead (see distDir in next.config.js).
 *
 * Written as a Node script rather than an inline env var so it works the same
 * in Command Prompt, PowerShell and bash.
 */
const { execSync } = require("child_process");

const DIST = ".next-build";

try {
  execSync("next build", {
    stdio: "inherit",
    env: { ...process.env, NEXT_DIST_DIR: DIST },
  });
  console.log(`\nBuilt into ${DIST}/ — your dev server's .next/ is untouched.`);
} catch {
  process.exit(1);
}
