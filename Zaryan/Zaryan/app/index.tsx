import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/welcome");
    }, 3000);
  }, []);
  return (
    <View style={{ backgroundColor: "black" }}>
      <Image
        style={[styles.logo, { width: "100%", height: "100%" }]}
        resizeMode="contain"
        source={require("@/assets/images/1.jpg")}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.natural900,
  },
  logo: {},
});
