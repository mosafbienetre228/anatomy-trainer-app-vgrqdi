
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize Metro for faster builds and better error handling
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), 'mjs', 'cjs'],
};

// Optimize transformer
config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    compress: {
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

// Enable source maps for better debugging
config.serializer = {
  ...config.serializer,
  customSerializer: undefined, // Remove any custom serializer that might cause issues
};

module.exports = config;
