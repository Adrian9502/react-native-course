import { View, TouchableOpacity, ImageBackground, Image } from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { WebView } from "react-native-webview";
import { icons } from "../constants";

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
  1: { transform: [{ scale: 1 }] },
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
      {play ? (
        <View
          style={{
            width: 208,
            height: 288,
            borderRadius: 35,
            marginTop: 12,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
          }}
        >
          <WebView
            source={{ uri: item.video }}
            style={{
              flex: 1, // Ensures WebView takes up the full space of its parent container
              borderRadius: 35,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          />
        </View>
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={{ width: 200, height: 300 }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

export default TrendingItem;
