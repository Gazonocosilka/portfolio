import type { NextConfig } from 'next';

/**
 * Static export for GitHub Pages.
 * Output: ./out (run `npm run build` then deploy `out/`).
 *
 * basePath/assetPrefix activate when deploying to <user>.github.io/<repo>.
 * Set `NEXT_PUBLIC_BASE_PATH=/portfolio` before build to enable.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  reactStrictMode: false, // R3F + postprocessing doesn't play nice with StrictMode double-invocation
};

export default nextConfig;
