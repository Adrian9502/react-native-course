import { View, Text, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { getCurrentUser, SignInUser, checkSession } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
interface FormState {
  email: string;
  password: string;
}
const SignIn = () => {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const sessionData = await checkSession();
        if (sessionData) {
          // If there's an active session, redirect to home
          router.replace("/(tabs)/Home");
        }
      } catch (error) {
        console.log("Session check error:", error);
      }
    };

    checkActiveSession();
  }, []);

  // submit function
  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Please fill all the fields.",
      });
      return;
    }

    console.log(form.email, form.password);

    setIsSubmitting(true);
    try {
      // First create the session
      await SignInUser(form.email, form.password);

      const userData = await getCurrentUser();

      // Update global context
      setUser(userData);
      setIsLoggedIn(true);

      // Navigate to home
      router.replace("/(tabs)/Home");
    } catch (error) {
      console.log("error login:", error);
      Toast.show({
        type: "error",
        text1: "Can't log in!",
        text2: error.message,
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
            Log in to Aora
          </Text>

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
            title="Sign In"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/SignUp"
              className="text-lg font-psemibold text-secondary-200"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
      <Toast position="bottom" bottomOffset={50} />
    </SafeAreaView>
  );
};

export default SignIn;
