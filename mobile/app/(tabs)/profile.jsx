import { useUser } from "@clerk/expo";
import { useState } from "react";
import { View, TextInput, Button } from "react-native";
import SafeScreen from "../../components/SafeScreen.jsx";

export default function profile() {
  const { user } = useUser();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const handleUpdateProfile = async () => {
    try {
      await user.update({
        firstName,
        lastName,
      });

      console.log("Profile updated");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View className="flex-1 bg-black items-center justify-center ">
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4 w-3/4 text-white"
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4 w-3/4 text-white"
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <Button title="Save" onPress={handleUpdateProfile} />
    </View>
  );
}
