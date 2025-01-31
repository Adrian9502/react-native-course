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
interface FormFieldProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string; // Optional custom styles for the container
  keyboardType?: KeyboardTypeOptions | string; // Optional keyboard type for TextInput
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType = "default", // Default keyboard type
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View
        className={`border-2 w-full flex-row h-16 px-4 bg-black-100 rounded-2xl items-center ${
          isFocused ? "border-secondary" : "border-black-200"
        }`}
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)} // Set focus state to true
          onBlur={() => setIsFocused(false)} // Set focus state to false
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
