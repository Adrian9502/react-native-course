import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import EmptyState from "../../components/EmptyState";
import { getUserPosts, logoutUser } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../../components/InfoBox";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
const Profile = () => {
  const { user, setUser, setIsLoggedIn, isLoading } = useGlobalContext();
  const { data: posts, loading } = useAppwrite(() =>
    user?.$id ? getUserPosts(user.$id) : null
  );

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Handle no user state
  if (!user) {
    router.replace("/SignIn");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/SignIn");
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Failed to logout. Please try again.",
      });
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={handleLogout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6 "
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyle="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex-row ">
              <InfoBox
                title={posts?.length.toString() || 0}
                subtitle="Posts"
                containerStyle="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() =>
          loading ? (
            <View className="flex-1 justify-center items-center mt-20">
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text className="text-white mt-4">Loading Videos...</Text>
            </View>
          ) : (
            <EmptyState
              title="No Videos Found"
              subtitle="Looks like you haven't created any videos yet!"
            />
          )
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
