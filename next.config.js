// next.config.js (in root directory, not in src)
module.exports = {
  trailingSlash: true,
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'puppeteer-core'],
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config, { isServer }) {
    config.experiments = { ...config.experiments, topLevelAwait: false };

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Only add puppeteer to externals on the server side
    if (isServer) {
      config.externals = [...(config.externals || []), 'puppeteer', 'puppeteer-core'];
    }

    return config;
  },
  // Add environment variables if needed
  env: {
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD,
  },
};
