
// Import URL polyfill FIRST before anything else
// This is critical for Supabase to work properly in React Native
import 'react-native-url-polyfill/auto';

// Import Reanimated configuration
// This must be imported before any components that use Reanimated
import 'react-native-reanimated';

// Import Expo Router entry point
// This starts the app and sets up routing
import 'expo-router/entry';

/**
 * TROUBLESHOOTING GUIDE FOR CALL STACK ISSUES
 * 
 * If you see "This call stack is not symbolicated" errors:
 * 
 * 1. Clear Metro bundler cache:
 *    - Stop the dev server
 *    - Run: npm run reset
 *    - Or manually: rm -rf node_modules/.cache && rm -rf .expo
 *    - Restart with: npm run start
 * 
 * 2. Ensure proper import order:
 *    - URL polyfill must be imported FIRST (already done above)
 *    - Reanimated must be imported before components
 *    - Never import 'react-native-url-polyfill/auto' in multiple files
 * 
 * 3. Check Metro configuration:
 *    - Source maps should be enabled (configured in metro.config.js)
 *    - Minifier should preserve function names
 * 
 * 4. Verify Babel configuration:
 *    - react-native-reanimated/plugin must be LAST in plugins array
 *    - Module resolver should be configured properly
 * 
 * 5. Common causes of symbolication errors:
 *    - Circular dependencies
 *    - Importing modules before polyfills
 *    - Corrupted Metro cache
 *    - Outdated dependencies
 * 
 * 6. If errors persist:
 *    - Check console logs for specific error messages
 *    - Look for red error screens with stack traces
 *    - Verify all imports are correct
 *    - Ensure no duplicate Supabase client instances
 */
