import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/expo";

export default function AuthRoutesLayout() {
  const { isSignedIn, getToken, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
