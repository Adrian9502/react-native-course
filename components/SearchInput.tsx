import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  KeyboardTypeOptions,
} from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { usePathname, router } from "expo-router";
import Toast from "react-native-toast-message";
// Define types for props
interface SearchInputProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string; // Optional custom styles for the container
  keyboardType?: KeyboardTypeOptions | string; // Optional keyboard type for TextInput
}

const SearchInput: React.FC<SearchInputProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  return (
    <View
      className={`border-2 w-full flex-row h-16 px-4 bg-black-100 rounded-2xl items-center space-x-4 ${
        isFocused ? "border-secondary" : "border-black-200"
      }`}
    >
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            Toast.show({
              type: "error",
              text1: "Missing Query",
              text2:
                "Please input something to search results across database.",
            });
          }
          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-6 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
