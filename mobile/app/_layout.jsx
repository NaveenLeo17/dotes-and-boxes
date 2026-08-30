import "../global.css";
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SocketProvider } from "../components/SocketProvider.jsx";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <SocketProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SocketProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
