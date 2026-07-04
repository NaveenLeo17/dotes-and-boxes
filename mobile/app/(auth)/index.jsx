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
    <View ClassName="flex-1 items-center justify-center bg-white">
      <View ClassName="gap-2">
        {/* Google Signin Button */}
        <TouchableOpacity
          ClassName="flow-row items-center justify-center bg-white border border-gray-300 rounded-full px-6"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View>
              <Image
                ClassName="size-10 mr-3"
                source={require("../../assets/google.png")}
                resizeMode="contain"
              />
              <Text ClassName="text-black font-medium text-base">
                Continue with Google
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Apple Signin Button */}
        <TouchableOpacity
          ClassName="flow-row items-center justify-center bg-white border border-gray-300 rounded-full px-6"
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View>
              <Image
                ClassName="size-10 mr-3"
                source={require("../../assets/apple.png")}
                resizeMode="contain"
              />
              <Text ClassName="text-black font-medium text-base">
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
