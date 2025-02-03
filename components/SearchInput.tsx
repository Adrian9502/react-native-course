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
  keyboardType = "default", // Default keyboard type
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`border-2 w-full flex-row h-16 px-4 bg-black-100 rounded-2xl items-center space-x-4 ${
        isFocused ? "border-secondary" : "border-black-200"
      }`}
    >
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={value}
        placeholder="Search for a video topic"
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)} // Set focus state to true
        onBlur={() => setIsFocused(false)} // Set focus state to false
      />
      <TouchableOpacity>
        <Image source={icons.search} className="w-6 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
