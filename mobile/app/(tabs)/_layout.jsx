import { Redirect, Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@clerk/expo";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BlurView } from "expo-blur";

import { StyleSheet } from "react-native";

import { useColorScheme } from "nativewind";

import colors from "../../theme/colors.js";

const TabsLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }

  const isDark = colorScheme === "dark";

  const theme = isDark ? colors.dark : colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        /*
         * =================================
         * TAB COLORS
         * =================================
         */

        tabBarActiveTintColor: theme.blue,

        tabBarInactiveTintColor: theme.tabInactive,

        /*
         * =================================
         * TAB BAR
         * =================================
         */

        tabBarStyle: {
          position: "absolute",

          backgroundColor: "transparent",

          borderTopWidth: 0,
          borderTopColor: "transparent",

          shadowColor: "transparent",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0,
          shadowRadius: 0,

          elevation: 0,

          height: 32 + insets.bottom,

          paddingTop: 4,

          marginHorizontal: 100,

          marginBottom: insets.bottom,

          borderRadius: 24,

          overflow: "hidden",
        },

        /*
         * =================================
         * BLUR BACKGROUND
         * =================================
         */

        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={isDark ? "dark" : "light"}
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: 24,
              },
            ]}
          />
        ),

        /*
         * =================================
         * TAB LABEL
         * =================================
         */

        tabBarLabelStyle: {
          fontSize: 12,

          fontWeight: "600",
        },
      }}
    >
      {/* HOME */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* HISTORY */}

      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-circle" size={size} color={color} />
          ),
        }}
      />

      {/* SETTINGS */}

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
