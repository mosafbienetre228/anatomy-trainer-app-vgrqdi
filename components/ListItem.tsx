
import React from "react";
import { Pressable, StyleSheet, useColorScheme, View, Text } from "react-native";
import Animated, {
  FadeIn,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "./IconSymbol";
import { IconCircle } from "./IconCircle";
import { appleRed, borderColor } from "@/constants/Colors";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
});

export default function ListItem({ listId }: { listId: string }) {
  const colorScheme = useColorScheme();

  const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 80 }],
      };
    });

    return (
      <Animated.View style={[styles.rightAction, styleAnimation]}>
        <IconSymbol
          ios_icon_name="trash.fill"
          android_material_icon_name="delete"
          size={24}
          color={appleRed}
        />
      </Animated.View>
    );
  };

  return (
    <Animated.View entering={FadeIn}>
      <ReanimatedSwipeable
        renderRightActions={RightAction}
        onSwipeableOpen={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
      >
        <Pressable
          style={[
            styles.container,
            { borderBottomColor: borderColor[colorScheme ?? 'light'] },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            console.log('List item pressed:', listId);
          }}
        >
          <IconCircle
            ios_icon_name="circle"
            android_material_icon_name="circle"
            size={24}
          />
          <View style={styles.content}>
            <Text>List Item {listId}</Text>
          </View>
        </Pressable>
      </ReanimatedSwipeable>
    </Animated.View>
  );
}
