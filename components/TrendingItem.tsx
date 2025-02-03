import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { Video, ResizeMode } from "expo-av";

interface Creator {
  username: string;
  avatar: string;
}

interface Item {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: Creator;
}

interface TrendingItemProps {
  activeItem: string;
  item: Item;
}

const zoomIn = {
  0: { transform: [{ scale: 0.9 }] },
  1: { transform: [{ scale: 1.1 }] },
};

const zoomOut = {
  0: { transform: [{ scale: 1 }] },
  1: { transform: [{ scale: 0.9 }] },
};

const TrendingItem: React.FC<TrendingItemProps> = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      <TouchableOpacity onPress={() => setPlay(!play)}>
        {play ? (
          <Video
            source={{ uri: item.video }}
            style={{ width: 200, height: 300 }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
          />
        ) : (
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={{ width: 200, height: 300 }}
            className="rounded-lg overflow-hidden"
          >
            <View className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50">
              <Text className="text-white text-lg font-bold">{item.title}</Text>
              <View className="flex-row items-center mt-1">
                <Image
                  source={{ uri: item.creator.avatar }}
                  style={{ width: 30, height: 30 }}
                  className="rounded-full mr-2"
                />
                <Text className="text-white">{item.creator.username}</Text>
              </View>
            </View>
          </ImageBackground>
        )}
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default TrendingItem;
