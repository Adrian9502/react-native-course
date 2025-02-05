import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { useVideoPlayer, VideoView } from "expo-video";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useGlobalContext();

  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const videoSource = form.video ? form.video.uri : null;

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });
  const handleSubmit = async () => {
    if (!user || !user.$id) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "User information is missing.",
      });
      return;
    }
    if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: "Please fill all the fields.",
      });
      return;
    }
    setUploading(true);
    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });
      Toast.hide();

      Toast.show({
        type: "success",
        text1: "Success!",
        text2: "Video Uploaded successfully. Returning to Home...",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

      router.push("/Home");
      Toast.hide();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: String(error),
      });
    } finally {
      setForm({ title: "", video: null, thumbnail: null, prompt: "" });
      setUploading(false);
    }
  };
  const openPicker = async (selectType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type:
          selectType === "image"
            ? ["image/png", "image/jpg"]
            : ["video/mp4", "video/gif"],
      });

      if (!result.canceled) {
        if (selectType === "image") {
          setForm({ ...form, thumbnail: result.assets[0] });
        }
        if (selectType === "video") {
          setForm({ ...form, video: result.assets[0] });
        }
      }
    } catch (error) {
      console.error("Document picker error:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full pb-10">
      <ScrollView className="px-4 py-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give you video a title"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <VideoView
                style={{
                  flex: 1,
                  height: 256,
                  borderRadius: 35,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                player={player} // Pass the player directly here
                allowsFullscreen
                allowsPictureInPicture
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100  justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
                source={{ uri: form.thumbnail.uri }}
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row gap-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-10"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={handleSubmit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
