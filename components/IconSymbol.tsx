
// This file is a fallback for using MaterialIcons on Android and web.

import React from "react";
import { SymbolWeight } from "expo-symbols";
import {
  OpaqueColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  ios_icon_name,
  android_material_icon_name,
  size = 24,
  color,
  style,
}: {
  ios_icon_name?: string;
  android_material_icon_name?: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Ensure we have a valid icon name with proper fallback
  const iconName = android_material_icon_name || 'help-outline';
  
  // Validate that the icon exists in MaterialIcons
  const validIconName = MaterialIcons.glyphMap[iconName] !== undefined 
    ? iconName 
    : 'help-outline';
  
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={validIconName}
      style={style as StyleProp<TextStyle>}
    />
  );
}
