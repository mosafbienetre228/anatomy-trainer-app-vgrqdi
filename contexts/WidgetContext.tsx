
import * as React from "react";
import { createContext, useCallback, useContext } from "react";
import { Platform } from "react-native";

// Stub implementation for WidgetContext
// This allows the app to build without @bacons/apple-targets
// If you need iOS widget functionality, install @bacons/apple-targets and update this file

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  // Stub implementation - no actual widget functionality
  React.useEffect(() => {
    console.log('WidgetProvider: Initialized (stub implementation)');
    
    // If you need iOS widget functionality:
    // 1. Install @bacons/apple-targets: npm install @bacons/apple-targets
    // 2. Uncomment and update the implementation below
    
    /*
    if (Platform.OS === 'ios') {
      const { ExtensionStorage } = require('@bacons/apple-targets');
      const storage = new ExtensionStorage("group.com.<user_name>.<app_name>");
      ExtensionStorage.reloadWidget();
    }
    */
  }, []);

  const refreshWidget = useCallback(() => {
    console.log('WidgetProvider: refreshWidget called (stub implementation)');
    
    // Stub implementation - no actual widget refresh
    // If you need iOS widget functionality, uncomment below:
    
    /*
    if (Platform.OS === 'ios') {
      const { ExtensionStorage } = require('@bacons/apple-targets');
      ExtensionStorage.reloadWidget();
    }
    */
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
