
import { Platform } from "react-native";

interface ErrorData {
  message: string;
  stack?: string;
  componentStack?: string;
}

// Simple error logging utility
export function logError(message: string): void {
  if (__DEV__) {
    console.error('[ERROR]', message);
  }
}

export function logWarning(message: string): void {
  if (__DEV__) {
    console.warn('[WARNING]', message);
  }
}

export function logInfo(message: string): void {
  if (__DEV__) {
    console.log('[INFO]', message);
  }
}

// Extract source location from stack trace
export function extractSourceLocation(stack: string): string | null {
  if (!stack) return null;
  
  const lines = stack.split('\n');
  for (const line of lines) {
    const match = line.match(/\((.+):(\d+):(\d+)\)/);
    if (match) {
      return `${match[1]}:${match[2]}:${match[3]}`;
    }
  }
  return null;
}

// Get caller information
export function getCallerInfo(): string {
  try {
    const stack = new Error().stack;
    if (stack) {
      const location = extractSourceLocation(stack);
      return location || 'Unknown location';
    }
  } catch (error) {
    console.log('Error getting caller info:', error);
  }
  return 'Unknown location';
}

// Send error to parent window (for web)
export function sendErrorToParent(level: string, message: string): void {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.parent !== window) {
    try {
      window.parent.postMessage(
        {
          type: 'error',
          level,
          message,
          timestamp: new Date().toISOString(),
        },
        '*'
      );
    } catch (error) {
      console.log('Error sending to parent:', error);
    }
  }
}

// Clear error after delay
export function clearErrorAfterDelay(errorKey: string, delayMs: number = 5000): void {
  setTimeout(() => {
    logInfo(`Clearing error: ${errorKey}`);
  }, delayMs);
}
