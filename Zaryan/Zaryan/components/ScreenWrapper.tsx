import { View, Text, Platform, Dimensions, StatusBar } from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ children, style }: ScreenWrapperProps) => {
  let padding = Platform.OS == "ios" ? height * 0.06 : 50;
  return (
    <View
      style={[
        {
          paddingTop: padding,
          backgroundColor: "black",
          flex: 1,
        },
        style,
      ]}
    >
      <StatusBar barStyle={"light-content"} />
      {children}
    </View>
  );
};

export default ScreenWrapper;
