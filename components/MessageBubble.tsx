import React from "react";
import { View, Text } from "react-native";

type Props = {
  msg: any;
  isArabic: boolean;
  colors: any;
  fontScale: number;
  dyslexiaMode: boolean;
  dyslexiaFont: boolean;
  readingLetterSpacing: number;
  readingExtraLineHeight: number;
  assistantBubbleBg: string;
  isFocused: boolean;
};

export default function MessageBubble({
  msg,
  isFocused,
  isArabic,
  colors,
  fontScale,
  dyslexiaMode,
  dyslexiaFont,
  readingLetterSpacing,
  readingExtraLineHeight,
  assistantBubbleBg,
}: Props) {
  return (
    <View
      style={[
        {
          maxWidth: "80%",
          marginBottom: 10,
          paddingHorizontal: 14 * fontScale,
          paddingVertical: 10 * fontScale,
          borderRadius: 16 * fontScale,
        },

        msg.isCurrentUser
          ? {
              alignSelf: "flex-end",
              backgroundColor: colors.bubble,
            }
          : {
              alignSelf: "flex-start",
              backgroundColor: assistantBubbleBg,
            },

        isFocused && {
          borderWidth: 4,
          borderColor: "#FFD400",
          backgroundColor: "#FFF9C4",
          transform: [{ scale: 1.05 }],
          shadowColor: "#FFD400",
          shadowOpacity: 0.8,
          shadowRadius: 12,
          elevation: 10,
        },
      ]}
    >
      <Text
        style={{
          color: msg.isCurrentUser ? colors.bubbleText : "#222222",
          fontSize: dyslexiaMode ? 17 * fontScale : 16 * fontScale,
          lineHeight: (24 + readingExtraLineHeight) * fontScale,
          letterSpacing: readingLetterSpacing,
          textAlign: dyslexiaMode ? "left" : "auto",
          fontWeight: dyslexiaMode ? "500" : "400",
          fontFamily: dyslexiaFont ? "OpenDyslexic" : undefined,
          writingDirection: isArabic ? "rtl" : "ltr",
        }}
      >
        {msg.message}
      </Text>
    </View>
  );
}