import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { InputProps } from "@/types";
import { colors, spacingX, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
const input = (props: InputProps) => {
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={colors.natural400}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.natural300,
    borderRadius: radius._17,
    paddingHorizontal: spacingX._15,
    borderCurve: "continuous",
    gap: spacingX._10,
  },

  input: {
    height: 20,
    flex: 1,
    color: colors.white,
    fontSize: verticalScale(14),
  },
});
