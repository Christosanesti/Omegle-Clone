import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import BackButton from "@/components/BackButton";
import { contain } from "three/src/extras/TextureUtils.js";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Input from "@/components/input";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    console.log(emailRef.current, passwordRef.current);
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30}>Welcome Back!</Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Login now to update your book-keepings
          </Typo>
          <Input
            onChangeText={(value) => (emailRef.current = value)}
            placeholder="Enter your email"
            placeholderTextColor={colors.white}
            style={{ color: colors.white }}
            containerStyle={{ justifyContent: "flex-start" }}
            icon={
              <Icons.Envelope
                size={verticalScale(26)}
                color={colors.natural300}
                weight="duotone"
              />
            }
          />
          <Input
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
            placeholder="Enter your password"
            placeholderTextColor={colors.text}
            style={{ color: colors.white }}
            containerStyle={{ justifyContent: "flex-start" }}
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.natural300}
                weight="duotone"
              />
            }
          />
          <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
            Forgot Password?
          </Typo>
          <TouchableOpacity
            disabled={isLoading}
            onPress={handleSubmit}
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
              paddingVertical: spacingY._15,
              borderCurve: "continuous",
              alignItems: "center",
              borderRadius: 8,
              shadowColor: colors.white,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Typo
              size={18}
              color={colors.white}
              style={{
                letterSpacing: 1,
                fontWeight: "600",
              }}
            >
              Login
            </Typo>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Typo size={14} color={colors.text}>
            Don't have an account?...
          </Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typo size={15} color={colors.textLight}>
              Sing Up!
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._25,
    paddingHorizontal: spacingX._25,
  },
  form: {
    gap: spacingY._15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(14),
  },
});
