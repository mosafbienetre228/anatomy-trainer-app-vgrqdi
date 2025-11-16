
import { Platform } from "react-native";

/**
 * Enhanced error logger with better symbolication support
 */

interface ErrorData {
  message: string;
  stack?: string;
  componentStack?: string;
  [key: string]: any;
}

const errorCache = new Map<string, NodeJS.Timeout>();

/**
 * Clear error after a delay to prevent spam
 */
export function clearErrorAfterDelay(errorKey: string, delayMs: number = 5000) {
  if (errorCache.has(errorKey)) {
    clearTimeout(errorCache.get(errorKey));
  }
  
  const timeout = setTimeout(() => {
    errorCache.delete(errorKey);
  }, delayMs);
  
  errorCache.set(errorKey, timeout);
}

/**
 * Send error to parent window (for web debugging)
 */
export function sendErrorToParent(level: string, message: string, data?: ErrorData) {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.parent !== window) {
    try {
      window.parent.postMessage(
        {
          type: 'error',
          level,
          message,
          data,
          timestamp: new Date().toISOString(),
        },
        '*'
      );
    } catch (error) {
      console.error('Failed to send error to parent:', error);
    }
  }
}

/**
 * Extract source location from error stack
 */
export function extractSourceLocation(stack: string): { file: string; line: number; column: number } | null {
  try {
    // Try to parse stack trace
    const stackLines = stack.split('\n');
    for (const line of stackLines) {
      // Match patterns like: at functionName (file.js:123:45)
      const match = line.match(/\((.+):(\d+):(\d+)\)/) || line.match(/at (.+):(\d+):(\d+)/);
      if (match) {
        return {
          file: match[1],
          line: parseInt(match[2], 10),
          column: parseInt(match[3], 10),
        };
      }
    }
  } catch (error) {
    console.error('Failed to extract source location:', error);
  }
  return null;
}

/**
 * Get caller information from stack trace
 */
export function getCallerInfo(): string {
  try {
    const error = new Error();
    const stack = error.stack || '';
    const stackLines = stack.split('\n');
    
    // Skip first 3 lines (Error, getCallerInfo, and the actual caller)
    if (stackLines.length > 3) {
      return stackLines[3].trim();
    }
  } catch (error) {
    console.error('Failed to get caller info:', error);
  }
  return 'Unknown caller';
}

/**
 * Log error with enhanced context
 */
export function logError(message: string, error?: Error | unknown, context?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const caller = getCallerInfo();
  
  console.error('=== ERROR LOG ===');
  console.error('Timestamp:', timestamp);
  console.error('Message:', message);
  console.error('Caller:', caller);
  
  if (context) {
    console.error('Context:', JSON.stringify(context, null, 2));
  }
  
  if (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      
      const location = extractSourceLocation(error.stack || '');
      if (location) {
        console.error('Location:', `${location.file}:${location.line}:${location.column}`);
      }
    } else {
      console.error('Error:', JSON.stringify(error, null, 2));
    }
  }
  
  console.error('=================');
  
  // Send to parent for web debugging
  sendErrorToParent('error', message, {
    message,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    caller,
  });
}

/**
 * Log warning with context
 */
export function logWarning(message: string, context?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const caller = getCallerInfo();
  
  console.warn('=== WARNING ===');
  console.warn('Timestamp:', timestamp);
  console.warn('Message:', message);
  console.warn('Caller:', caller);
  
  if (context) {
    console.warn('Context:', JSON.stringify(context, null, 2));
  }
  
  console.warn('===============');
  
  sendErrorToParent('warning', message, { message, context, caller });
}

/**
 * Log info with context
 */
export function logInfo(message: string, context?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  
  console.log('=== INFO ===');
  console.log('Timestamp:', timestamp);
  console.log('Message:', message);
  
  if (context) {
    console.log('Context:', JSON.stringify(context, null, 2));
  }
  
  console.log('============');
}
