import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _Layout;

const styles = StyleSheet.create({});
