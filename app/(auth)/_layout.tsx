import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Stack } from "expo-router";
const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="SignIn"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="SignUp"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
