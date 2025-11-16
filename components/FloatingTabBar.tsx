
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, usePathname } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import { Href } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  iosIcon?: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 40,
  borderRadius = 24,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const activeIndex = useSharedValue(0);

  const handleTabPress = (route: Href, index: number) => {
    activeIndex.value = withSpring(index);
    router.push(route);
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [{ translateX: withSpring(activeIndex.value * tabWidth) }],
      width: tabWidth,
    };
  });

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[
        styles.safeArea,
        {
          bottom: bottomMargin,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius: borderRadius,
          },
        ]}
      >
        <BlurView
          intensity={80}
          tint={theme.dark ? 'dark' : 'light'}
          style={[
            styles.blurContainer,
            {
              borderRadius: borderRadius,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.activeIndicator,
              animatedIndicatorStyle,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const isActive = pathname.includes(tab.name);
              if (isActive && activeIndex.value !== index) {
                activeIndex.value = index;
              }

              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.tab}
                  onPress={() => handleTabPress(tab.route as Href, index)}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name={tab.iosIcon}
                    android_material_icon_name={tab.icon as keyof typeof MaterialIcons.glyphMap}
                    size={24}
                    color={isActive ? '#FFFFFF' : theme.colors.text}
                  />
                  <Text
                    style={[
                      styles.label,
                      {
                        color: isActive ? '#FFFFFF' : theme.colors.text,
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  blurContainer: {
    overflow: 'hidden',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
    zIndex: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    height: '80%',
    top: '10%',
    borderRadius: 16,
    zIndex: 1,
  },
});
