import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";

import useSocialAuth from "../../hooks/useSocialAuth.js";

const AuthScreen = () => {
  const { isLoading, handleSocialAuth } = useSocialAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-[#121212]">
      <View className="w-full gap-4 px-6">
        {/* Google Signin Button */}

        <TouchableOpacity
          className="h-14 flex-row items-center justify-center rounded-full border border-gray-300 bg-white px-6 dark:border-gray-700 dark:bg-[#1E1E1E]"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <View className="flex-row items-center">
              <Image
                className="mr-3 h-8 w-8"
                source={require("../../assets/google.png")}
                resizeMode="contain"
              />

              <Text className="text-base font-medium text-black dark:text-white">
                Continue with Google
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Apple Signin Button */}

        <TouchableOpacity
          className="h-14 flex-row items-center justify-center rounded-full border border-gray-300 bg-white px-6 dark:border-gray-700 dark:bg-[#1E1E1E]"
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <View className="flex-row items-center">
              <Image
                className="mr-3 h-8 w-8"
                source={require("../../assets/apple.png")}
                resizeMode="contain"
              />

              <Text className="text-base font-medium text-black dark:text-white">
                Continue with Apple
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthScreen;
