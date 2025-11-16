
# Troubleshooting Guide - Anatomy Trainer App

Quick reference for common issues and their solutions.

---

## 🔥 Common Build Errors

### 1. Module Resolution Errors

**Error:**
```
Unable to resolve module [package-name] from [file-path]
```

**Solutions:**
1. Check if package is installed: `npm list [package-name]`
2. Install missing package: `npm install [package-name]`
3. Clear cache: `npm run reset`
4. Rebuild: `npm run prebuild`

**Prevention:**
- Always use `install_dependencies` tool
- Never manually edit `package.json` without installing
- Keep dependencies in sync across team

---

### 2. Metro Bundler Issues

**Error:**
```
Serializer did not return expected format
```

**Solutions:**
1. Clear Metro cache: `npm run reset`
2. Check `metro.config.js` for custom serializers
3. Remove any custom serializer configurations
4. Restart Metro bundler

**Prevention:**
- Keep Metro config simple
- Avoid custom serializers unless necessary
- Use default Expo Metro config as base

---

### 3. Supabase Connection Issues

**Error:**
```
Cannot read properties of undefined (reading 'auth')
```

**Solutions:**
1. Check Supabase URL and anon key in `utils/supabase.ts`
2. Verify `react-native-url-polyfill/auto` is imported first
3. Check network connection
4. Verify Supabase project is active

**Prevention:**
- Always import URL polyfill before Supabase
- Use lazy loading in contexts
- Add proper error handling
- Check environment variables

---

### 4. Font Loading Errors

**Error:**
```
Font 'SpaceMono' is not loaded
```

**Solutions:**
1. Wait for fonts to load before rendering
2. Check font files exist in `assets/fonts/`
3. Verify `useFonts` hook is used correctly
4. Add error handling for font loading

**Prevention:**
- Use `appReady` state to manage loading
- Show loading screen while fonts load
- Handle font loading errors gracefully
- Don't block app if fonts fail to load

---

## 🐛 Runtime Errors

### 1. Context Not Available

**Error:**
```
useSupabase must be used within a SupabaseProvider
```

**Solutions:**
1. Wrap app with provider in `_layout.tsx`
2. Check provider order (SupabaseProvider should be inside ThemeProvider)
3. Verify component is child of provider

**Prevention:**
- Always use context hooks inside provider
- Add fallback values in hook definitions
- Log warnings instead of throwing errors

---

### 2. Navigation Errors

**Error:**
```
The action 'NAVIGATE' was not handled by any navigator
```

**Solutions:**
1. Check route exists in file structure
2. Verify screen is registered in Stack
3. Use correct route path format
4. Check for typos in route names

**Prevention:**
- Use TypeScript typed routes
- Test navigation after adding new screens
- Follow Expo Router file-based routing conventions

---

### 3. Authentication Errors

**Error:**
```
Email not confirmed
```

**Solutions:**
1. Check email inbox for verification link
2. Verify `emailRedirectTo` is set correctly
3. Resend verification email
4. Check Supabase email settings

**Prevention:**
- Always show verification reminder after signup
- Display error messages from auth responses
- Implement email resend functionality
- Test email flow in development

---

## 📱 Platform-Specific Issues

### iOS

**Issue:** App crashes on launch

**Solutions:**
1. Clean build: `cd ios && pod install && cd ..`
2. Clear derived data
3. Check Info.plist for required permissions
4. Verify bundle identifier

---

### Android

**Issue:** App crashes on launch

**Solutions:**
1. Clean build: `cd android && ./gradlew clean && cd ..`
2. Check AndroidManifest.xml
3. Verify package name
4. Check for permission issues

---

### Web

**Issue:** Features not working on web

**Solutions:**
1. Check for native-only dependencies
2. Use platform-specific files (.web.tsx)
3. Add web polyfills if needed
4. Test in different browsers

---

## 🔧 Development Issues

### 1. Hot Reload Not Working

**Solutions:**
1. Restart Metro bundler
2. Clear cache: `npm run reset`
3. Check for syntax errors
4. Verify file is saved

---

### 2. TypeScript Errors

**Solutions:**
1. Run `npx tsc --noEmit` to check types
2. Update type definitions
3. Check for missing imports
4. Verify interface definitions

---

### 3. Styling Issues

**Solutions:**
1. Check for platform-specific styles
2. Verify theme is applied correctly
3. Test in both light and dark mode
4. Check for conflicting styles

---

## 🚀 Performance Issues

### 1. Slow App Startup

**Solutions:**
1. Optimize splash screen
2. Lazy load heavy components
3. Reduce initial bundle size
4. Profile with React DevTools

---

### 2. Laggy Animations

**Solutions:**
1. Use `react-native-reanimated` for animations
2. Enable `useNativeDriver` where possible
3. Reduce animation complexity
4. Profile with Performance Monitor

---

### 3. Memory Leaks

**Solutions:**
1. Clean up subscriptions in useEffect
2. Remove event listeners on unmount
3. Cancel pending promises
4. Use React DevTools Profiler

---

## 📊 Debugging Tools

### Console Logging

```typescript
// Add strategic console.logs
console.log('Component mounted:', componentName);
console.log('State updated:', state);
console.error('Error occurred:', error);
```

### React DevTools

```bash
# Install React DevTools
npm install -g react-devtools

# Run
react-devtools
```

### Expo DevTools

```bash
# Open DevTools
npm run dev

# Press 'm' to open menu
# Press 'j' to open debugger
```

### Network Debugging

```typescript
// Log all Supabase requests
const supabase = createClient(url, key, {
  global: {
    fetch: (url, options) => {
      console.log('Supabase request:', url);
      return fetch(url, options);
    },
  },
});
```

---

## 🆘 Getting Help

### Before Asking for Help:

1. ✅ Check this troubleshooting guide
2. ✅ Read error messages carefully
3. ✅ Check console logs
4. ✅ Try clearing cache
5. ✅ Search for similar issues online

### When Asking for Help:

Include:
- Error message (full text)
- Steps to reproduce
- Platform (iOS/Android/Web)
- Environment (dev/production)
- Relevant code snippets
- Console logs

### Resources:

- Expo Documentation: https://docs.expo.dev
- React Native Documentation: https://reactnative.dev
- Supabase Documentation: https://supabase.com/docs
- Stack Overflow: https://stackoverflow.com
- Expo Discord: https://chat.expo.dev

---

## 🎯 Quick Fixes

### Clear Everything and Start Fresh:

```bash
# Nuclear option - clears everything
npm run clean
npm install
npm run dev
```

### Reset Metro Bundler:

```bash
npm run reset
```

### Rebuild Native Code:

```bash
npm run prebuild
```

### Update Dependencies:

```bash
npm update
npm audit fix
```

---

**Last Updated:** 2025-01-16  
**Version:** 1.0.0
