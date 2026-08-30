import React from "react";

import { View, Text, Pressable } from "react-native";

import { useRouter } from "expo-router";

import SafeScreen from "../../components/SafeScreen.jsx";

const Index = () => {
  const router = useRouter();

  const openOfflineGame = () => {
    router.push("/game");
  };

  return (
    <SafeScreen>
      <View className="flex-1 items-center bg-app-light px-6 py-3 dark:bg-app-dark">
        {/* MAIN CONTENT */}

        <View className="w-full max-w-[420px] flex-1 items-center justify-center">
          {/* GAME LOGO */}

          <View className="relative mb-[18px] h-[140px] w-[140px] items-center justify-center rounded-[30px] border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
            {/* Top horizontal line */}

            <View className="absolute left-[41px] top-[48px] h-[5px] w-[58px] rounded-[3px] bg-primary" />

            {/* Bottom horizontal line */}

            <View className="absolute bottom-[48px] left-[41px] h-[5px] w-[58px] rounded-[3px] bg-secondary" />

            {/* Left vertical line */}

            <View className="absolute left-[48px] top-[41px] h-[58px] w-[5px] rounded-[3px] bg-primary" />

            {/* Right vertical line */}

            <View className="absolute right-[48px] top-[41px] h-[58px] w-[5px] rounded-[3px] bg-secondary" />

            {/* Top-left dot */}

            <View className="absolute left-[43px] top-[43px] h-[10px] w-[10px] rounded-full bg-primary" />

            {/* Top-right dot */}

            <View className="absolute right-[43px] top-[43px] h-[10px] w-[10px] rounded-full bg-secondary" />

            {/* Bottom-left dot */}

            <View className="absolute bottom-[43px] left-[43px] h-[10px] w-[10px] rounded-full bg-secondary" />

            {/* Bottom-right dot */}

            <View className="absolute bottom-[43px] right-[43px] h-[10px] w-[10px] rounded-full bg-primary" />
          </View>

          {/* TITLE */}

          <Text className="text-[32px] font-black tracking-[0.5px] text-light-text dark:text-dark-text">
            Dots & Boxes
          </Text>

          <Text className="mt-[7px] text-[14px] text-light-textSecondary dark:text-dark-textSecondary">
            Connect. Complete. Conquer.
          </Text>

          {/* GAME BUTTONS */}

          <View className="mt-8 w-full max-w-[360px]">
            {/* OFFLINE MODE CARD */}

            <View className="h-[76px] w-full overflow-hidden rounded-[14px] border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
              <Pressable
                onPress={openOfflineGame}
                className="h-full w-full items-center justify-center px-5"
              >
                {({ pressed }) => (
                  <View
                    className={`h-full w-full items-center justify-center ${
                      pressed
                        ? "bg-elevated-light dark:bg-elevated-dark"
                        : "bg-transparent"
                    }`}
                  >
                    <Text className="text-[16px] font-extrabold text-light-text dark:text-dark-text">
                      Offline Mode
                    </Text>

                    <Text className="mt-[3px] text-[12px] text-light-textSecondary dark:text-dark-textSecondary">
                      Play on this device
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* ONLINE MODE CARD */}

            <View className="relative mt-[14px] h-[76px] w-full overflow-visible rounded-[14px] border border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark">
              <Pressable
                disabled
                className="h-full w-full items-center justify-center rounded-[14px] bg-surface-light px-5 opacity-55 dark:bg-surface-dark"
              >
                <Text className="text-[16px] font-extrabold text-light-text dark:text-dark-text">
                  Online Mode
                </Text>

                <Text className="mt-[3px] text-[12px] text-light-textSecondary dark:text-dark-textSecondary">
                  Multiplayer
                </Text>
              </Pressable>

              {/* COMING SOON */}

              <View className="absolute -right-[1px] -top-[9px] rounded-full border border-border-light bg-elevated-light px-[9px] py-1 dark:border-border-dark dark:bg-elevated-dark">
                <Text className="text-[9px] font-black tracking-[0.3px] text-light-textSecondary dark:text-dark-textSecondary">
                  COMING SOON
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeScreen>
  );
};

export default Index;
