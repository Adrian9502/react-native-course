import { View, FlatList } from "react-native";
import React, { useState } from "react";
import TrendingItem from "./TrendingItem";

interface Creator {
  username: string;
  avatar: string;
}

interface Post {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: Creator;
}

interface TrendingProps {
  posts: Post[]; // Accepts an array of posts
}

const Trending: React.FC<TrendingProps> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState<string>("");

  return (
    <View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TrendingItem activeItem={activeItem} item={item} />
        )}
        onScroll={({ nativeEvent }) => {
          const index = Math.round(
            nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
          );
          setActiveItem(posts[index]?.$id); // Set the active item based on scroll
        }}
      />
    </View>
  );
};

export default Trending;
