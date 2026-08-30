import React from "react";

import { View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

function SafeScreen({ children }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {children}
    </View>
  );
}

export default SafeScreen;
