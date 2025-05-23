import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
const welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            style={styles.loginButton}
          >
            <Typo fontWeight={400}>Sign In</Typo>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require("@/assets/images/logo.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>
        <Animated.View
          entering={FadeInDown.duration(1000).delay(400)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            style={{
              backgroundColor: colors.white,
              paddingVertical: spacingY._17,
              borderRadius: 30,
              alignItems: "center",
              shadowColor: colors.white,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
              transform: [{ scale: 1 }], // For animation base state
            }}
            activeOpacity={0.8}
            onPress={() => {
              // Add navigation or action here
            }}
          >
            <Typo color={colors.black} fontWeight={600} size={20}>
              Get Started
            </Typo>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(800)}
            style={{ alignItems: "center" }}
          >
            <Typo>Zaryan Co.</Typo>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._5,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: "black",
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
    color: "white",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
