/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * `next build` writes production output into the same directory `next dev`
   * uses, which wipes the dev artifacts out from under any running dev server —
   * the page then 404s on its CSS chunk and renders completely unstyled.
   *
   * Setting NEXT_DIST_DIR sends a build somewhere else so it can run safely
   * while `npm run dev` is up. Unset, behaviour is stock (.next).
   *   npm run build:safe
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
