import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Video, ResizeMode } from "expo-av";

interface Creator {
  username: string;
  avatar: string;
}

interface VideoProps {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: Creator;
}

interface VideoCardProps {
  video: VideoProps;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}) => {
  const [play, setPlay] = useState<boolean>(false);

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-full overflow-hidden">
            <Image source={{ uri: avatar }} className="w-full h-full" />
          </View>
          <View className="ml-3">
            <Text className="text-lg font-semibold">{username}</Text>
            <Text className="text-sm text-gray-500">{title}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="mt-4 w-full h-60 rounded-lg overflow-hidden"
        onPress={() => setPlay(!play)}
      >
        {play ? (
          <Video
            source={{ uri: typeof video === "string" ? video : "" }}
            style={{ width: "100%", height: "100%" }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
          />
        ) : (
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VideoCard;
