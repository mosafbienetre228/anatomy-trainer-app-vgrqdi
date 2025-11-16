
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize Metro for faster builds
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'mjs', 'cjs'],
};

// Optimize transformer for production builds
config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    compress: {
      // Drop console logs in production
      drop_console: false,
    },
    mangle: {
      keep_fnames: true,
    },
    output: {
      comments: false,
    },
  },
};

// Enable caching for faster rebuilds
config.cacheStores = [
  {
    get: async () => null,
    set: async () => {},
  },
];

module.exports = config;
