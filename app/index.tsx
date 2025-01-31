import { Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
const App = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="my-5 font-pblack">this is the child component</Text>
      <StatusBar style="auto" />
      <Link href="/Profile" style={{ color: "blue" }}>
        Go to Profile
      </Link>
    </View>
  );
};

export default App;
