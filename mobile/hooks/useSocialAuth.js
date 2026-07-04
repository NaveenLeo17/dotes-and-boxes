import { useSSO } from "@clerk/expo";
import { use, useState } from "react";
import { Alert } from "react-native";
import * as Linking from "expo-linking";

function useSocialAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { startSSOFlow } = useSSO();

  const redirectUrl = Linking.createURL("/", {
    scheme: "dotesandboxes",
  });

  const handleSocialAuth = async (strategy) => {
    setIsLoading(() => true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      console.log("Error in social auth", error);
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`,
      );
    } finally {
      setIsLoading(() => false);
    }
  };

  return { isLoading, handleSocialAuth };
}

export default useSocialAuth;
