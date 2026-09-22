import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder catalog art is generated locally as SVG (see scripts/generate-art.mjs).
    // Once real product photography is uploaded this can be removed.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
