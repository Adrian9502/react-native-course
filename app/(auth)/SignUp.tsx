import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import Toast from "react-native-toast-message";
import { AppwriteException } from "react-native-appwrite";

interface FormState {
  userName: string;
  email: string;
  password: string;
}
const SignUp = () => {
  const [form, setForm] = useState<FormState>({
    userName: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // submit function
  const handleSubmit = async (): Promise<void> => {
    if (!form.userName || !form.email || !form.password) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Please fill all the fields.",
      });
      return; // Exit early if fields are empty
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.userName);

      // Set it to global state (if needed)

      router.replace("/Home");
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof AppwriteException) {
        // Handle specific Appwrite errors
        if (error.message.includes("Invalid `password` param")) {
          errorMessage =
            "Password must be between 8 and 265 characters long and should not be commonly used.";
        } else {
          errorMessage = error.message; // Fallback to the original error message
        }
      } else if (error instanceof Error) {
        errorMessage = error.message; // Handle generic errors
      }

      Toast.show({
        type: "error",
        text1: "Error!",
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white font-psemibold mt-10">
            Sign up to Aora
          </Text>

          <FormField
            title="Username"
            value={form.userName}
            handleChangeText={(e) => setForm({ ...form, userName: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="password"
          />
          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/SignIn"
              className="text-lg font-psemibold text-secondary-200"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
      <Toast position="bottom" bottomOffset={50} />
    </SafeAreaView>
  );
};

export default SignUp;
