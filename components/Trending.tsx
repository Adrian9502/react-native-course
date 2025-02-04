import { View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (posts && posts.length > 0) {
      setActiveItem(posts[0].$id);
    }
  }, [posts]);
  const viewAbleItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };
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
        onViewableItemsChanged={viewAbleItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        contentOffset={{ x: 170, y: 0 }}
      />
    </View>
  );
};

export default Trending;
