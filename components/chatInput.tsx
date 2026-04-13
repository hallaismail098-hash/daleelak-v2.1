import React, { useState } from "react";
import { View, TextInput, Pressable, Text, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BORDER_WIDTH,
  FONT_SIZE,
  NEUTRAL,
  RADIUS,
  SCREEN_EDGE,
  SPACING,
} from "@/constants/design";
import {
  CONTROL_RADIUS,
  CONTROL_SPACING,
  HIT_SLOP,
  TOUCH_TARGET,
} from "@/constants/interaction";

type Props = {
  message: string;
  setMessage: (v: string) => void;
  handleSend: () => void;
  triggerVoiceInput: () => void;
  isListening: boolean;
  isLoading: boolean;
  isArabic: boolean;
  colors: any;
  easyTapMode: boolean;
};

export default function ChatInput({
  message,
  setMessage,
  handleSend,
  triggerVoiceInput,
  isListening,
  isLoading,
  isArabic,
  colors,
  easyTapMode,
}: Props) {
  const [showSendHint, setShowSendHint] = useState(false);
  const [showMicHint, setShowMicHint] = useState(false);
  const outerBorderColor = colors?.line ?? "rgba(255,255,255,0.9)";
  const inputTextColor = colors?.text ?? "#1F2937";
  const placeholderTextColor = colors?.accent ?? "#6B7280";
  const inputBackgroundColor = colors?.background ?? "#FFFFFF";
  const inputBorderColor = colors?.accent ?? "#004030";
  const sendDisabled = isLoading || !message.trim();
  const controlSize = easyTapMode ? TOUCH_TARGET + 8 : TOUCH_TARGET;
  const controlSpacing = easyTapMode ? CONTROL_SPACING + 6 : CONTROL_SPACING + 4;
  const inputVerticalPadding = easyTapMode ? SPACING.sm : SPACING.xs;
  const containerVerticalPadding = easyTapMode ? SPACING.md + 2 : SPACING.md;
  const hitSlop = easyTapMode
    ? { top: 12, bottom: 12, left: 12, right: 12 }
    : HIT_SLOP;

  const Tooltip = ({ text }: { text: string }) => (
    <View
      style={{
        position: "absolute",
        bottom: 55,
        backgroundColor: NEUTRAL.tooltipBg,
        paddingHorizontal: SPACING.section,
        paddingVertical: SPACING.xs + 2,
        borderRadius: RADIUS.sm,
        zIndex: 999,
      }}
    >
      <Text style={{ color: NEUTRAL.white, fontSize: FONT_SIZE.sm }}>{text}</Text>
    </View>
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: containerVerticalPadding,
        paddingHorizontal: SCREEN_EDGE.horizontal,
        borderRadius: RADIUS.xl,
        backgroundColor: colors.input,
        borderWidth: BORDER_WIDTH.regular,
        borderColor: outerBorderColor,
      }}
    >

      {/* MIC BUTTON */}
      <View style={{ position: "relative" }}>
        {showMicHint && (
          <Tooltip text={isArabic ? "إدخال صوتي" : "Voice input"} />
        )}

        <Pressable
          onPress={triggerVoiceInput}
          onLongPress={() => setShowMicHint(true)}
          onPressOut={() => setShowMicHint(false)}
          {...(Platform.OS === "web"
            ? {
                onMouseEnter: () => setShowMicHint(true),
                onMouseLeave: () => setShowMicHint(false),
              }
            : {})}
          style={({ pressed }) => ({
            width: controlSize,
            height: controlSize,
            marginRight: controlSpacing,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: CONTROL_RADIUS,
            backgroundColor: isListening
              ? NEUTRAL.whiteMedium
              : pressed
              ? NEUTRAL.whiteMuted
              : "transparent",
            borderWidth: isListening ? BORDER_WIDTH.regular : BORDER_WIDTH.thin,
            borderColor: isListening
              ? NEUTRAL.white
              : NEUTRAL.whiteBorderMedium,
          })}
          hitSlop={hitSlop}
          accessibilityRole="button"
          accessibilityState={{ selected: isListening }}
          accessibilityLabel={isArabic ? "إدخال صوتي" : "Voice input"}
        >
          <Ionicons
            name={isListening ? "mic" : "mic-outline"}
            size={22}
            color={NEUTRAL.white}
          />
        </Pressable>
      </View>

      {/* MESSAGE INPUT */}
      <View
        style={{
          flex: 1,
          backgroundColor: inputBackgroundColor,
          borderWidth: BORDER_WIDTH.strong,
          borderColor: inputBorderColor,
          borderRadius: CONTROL_RADIUS,
          paddingHorizontal: 12,
          paddingVertical: inputVerticalPadding,
        }}
      >
        <Text
          style={{
            color: inputBorderColor,
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            marginBottom: SPACING.xs,
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {isArabic ? "الرسالة" : "Message"}
        </Text>
        <TextInput
          multiline
          value={message}
          onChangeText={setMessage}
          placeholder={isArabic ? "اكتب رسالتك" : "Enter your message"}
          placeholderTextColor={placeholderTextColor}
          accessibilityLabel={isArabic ? "حقل الرسالة" : "Message field"}
          accessibilityHint={
            isArabic
              ? "اكتب رسالتك هنا ثم اضغط إرسال"
              : "Type your message here, then press send"
          }
          accessibilityLanguage={isArabic ? "ar" : "en"}
          style={{
            minHeight: controlSize,
            paddingVertical: SPACING.section,
            color: inputTextColor,
            fontSize: FONT_SIZE.base,
          }}
        />
      </View>

      {/* SEND BUTTON */}
      <View style={{ position: "relative" }}>
        {showSendHint && (
          <Tooltip text={isArabic ? "إرسال الرسالة" : "Send message"} />
        )}

        <Pressable
          onPress={handleSend}
          disabled={sendDisabled}
          onLongPress={() => setShowSendHint(true)}
          onPressOut={() => setShowSendHint(false)}
          {...(Platform.OS === "web"
            ? {
                onMouseEnter: () => setShowSendHint(true),
                onMouseLeave: () => setShowSendHint(false),
              }
            : {})}
          style={({ pressed }) => ({
            width: controlSize,
            height: controlSize,
            marginLeft: controlSpacing,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: CONTROL_RADIUS,
            backgroundColor: sendDisabled
              ? NEUTRAL.whiteSoft
              : pressed
              ? NEUTRAL.whiteStrong
              : NEUTRAL.whiteSubtle,
            borderWidth: BORDER_WIDTH.thin,
            borderColor: sendDisabled
              ? NEUTRAL.whiteBorderSoft
              : NEUTRAL.whiteBorderStrong,
            opacity: sendDisabled ? 0.55 : 1,
          })}
          hitSlop={hitSlop}
          accessibilityRole="button"
          accessibilityState={{ disabled: sendDisabled, busy: isLoading }}
          accessibilityLabel={isArabic ? "إرسال الرسالة" : "Send message"}
        >
          <Ionicons
            name="arrow-forward-outline"
            size={24}
            color={NEUTRAL.white}
          />
        </Pressable>
      </View>
    </View>
  );
}
