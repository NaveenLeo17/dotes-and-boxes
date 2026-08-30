import React from "react";

import { View, Text, Switch, SafeAreaView } from "react-native";

import { useColorScheme } from "nativewind";

const Settings = () => {
  const { colorScheme, setColorScheme } = useColorScheme();

  const darkMode = colorScheme === "dark";

  const toggleDarkMode = () => {
    setColorScheme(darkMode ? "light" : "dark");
  };

  return (
    <SafeAreaView className="flex-1 bg-app-light dark:bg-app-dark">
      <View className="px-5 pt-5">
        {/* TITLE */}

        <Text className="mb-8 text-[28px] font-bold text-text-light dark:text-text-dark">
          Settings
        </Text>

        {/* DARK MODE */}

        <View className="flex-row items-center justify-between border-b border-border-light py-4 dark:border-border-dark">
          <Text className="text-[17px] font-medium text-text-light dark:text-text-dark">
            Dark Mode
          </Text>

          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{
              false: "#D9DAD7",
              true: "#70B58B",
            }}
            thumbColor="#F5F5F2"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
