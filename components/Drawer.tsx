import React from "react";
import { View, Text, Pressable, AccessibilityInfo } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGrayscale } from "@/context/GrayscaleContext";
import HelpPanel from "./help";
import Contrast from "./contrast";
import {
  BORDER_WIDTH,
  FONT_SIZE,
  ICON_SIZE as DESIGN_ICON_SIZE,
  NEUTRAL,
  RADIUS,
  SPACING,
} from "@/constants/design";
import {
  CONTROL_PADDING,
  CONTROL_RADIUS,
  CONTROL_SPACING,
  HIT_SLOP,
  PANEL_PADDING,
  TOUCH_TARGET,
} from "@/constants/interaction";

type ContrastSet = {
  labelKey: string;
};

type Props = {
  isArabic: boolean;
  colors: any;
  helpOpen: boolean;
  toggleHelp: () => void;

  speechEnabled: boolean;
  readerMode: boolean;
  simpleMode: boolean;
  focusMode: boolean;

  dyslexiaFont: boolean;
  dyslexiaSpacing: boolean;
  easyTapMode: boolean;

  toggleSpeech: () => void;
  toggleReaderMode: () => void;
  toggleSimpleMode: () => void;
  toggleFocusMode: () => void;
  toggleEasyTapMode: () => void;

  toggleDyslexiaFont: () => void;
  toggleDyslexiaSpacing: () => void;

  increaseFont: () => void;
  decreaseFont: () => void;

  resetAccessibility: () => void;

  contrastLevel: number;
  setContrastLevel: (v: number) => void;
  contrastSets: ContrastSet[];

  t: any;
  announce: (text: string) => void;
  styles: any;
};

export default function Drawer({
  isArabic,
  colors,
  helpOpen,
  toggleHelp,

  speechEnabled,

  simpleMode,
  focusMode,

  dyslexiaFont,
  dyslexiaSpacing,
  easyTapMode,

  toggleSpeech,

  toggleSimpleMode,
  toggleFocusMode,
  toggleEasyTapMode,

  toggleDyslexiaFont,
  toggleDyslexiaSpacing,

  increaseFont,
  decreaseFont,

  resetAccessibility,

  contrastLevel,
  setContrastLevel,
  contrastSets,

  t,
  announce,
  styles,
}: Props) {
  const { grayscaleEnabled, toggleGrayscale } = useGrayscale();
  const toolSpacing = easyTapMode ? CONTROL_SPACING + 4 : CONTROL_SPACING;
  const toolMinHeight = easyTapMode ? 92 : 84;
  const toolPaddingY = easyTapMode ? SPACING.md : SPACING.section;
  const controlHitSlop = easyTapMode
    ? { top: 10, bottom: 10, left: 10, right: 10 }
    : HIT_SLOP;

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: SPACING.sm,
        borderRadius: RADIUS.lg,
        borderWidth: BORDER_WIDTH.thin,
        padding: PANEL_PADDING,
        backgroundColor: colors.panel,
        borderColor: colors.line,
      }}
    >
      {/* HEADER */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: SPACING.section,
        }}
      >
        <Text
          style={{
            fontSize: FONT_SIZE.base,
            fontWeight: "700",
            color: colors.text,
          }}
        >
          {isArabic ? "أدوات إمكانية الوصول" : "Accessibility tools"}
        </Text>

        <Pressable
          onPress={toggleHelp}
          accessibilityRole="button"
          accessibilityLabel={isArabic ? "المساعدة" : "Help"}
          accessibilityState={{ expanded: helpOpen }}
          hitSlop={controlHitSlop}
          style={({ pressed }) => ({
            width: TOUCH_TARGET,
            height: TOUCH_TARGET,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: CONTROL_RADIUS,
            backgroundColor: helpOpen
              ? colors.accent
              : pressed
              ? colors.card
              : "transparent",
            borderWidth: BORDER_WIDTH.thin,
            borderColor: helpOpen ? colors.accent : colors.line,
          })}
        >
          <Ionicons
            name={helpOpen ? "help-circle" : "help-circle-outline"}
            size={DESIGN_ICON_SIZE.lg}
            color={helpOpen ? NEUTRAL.white : colors.accent}
          />
        </Pressable>
      </View>

      {/* HELP PANEL */}

      {helpOpen && <HelpPanel isArabic={isArabic} colors={colors} />}

      {/* TOOLS GRID */}

      <View style={gridStyle}>

        <Tool
          icon={speechEnabled ? "volume-high-outline" : "volume-mute-outline"}
          label={isArabic ? "الصوت" : "Voice"}
          hint={
            isArabic
              ? "تشغيل أو إيقاف قراءة الرسائل صوتيًا"
              : "Turn voice reading on or off"
          }
          onPress={toggleSpeech}
          colors={colors}
          active={speechEnabled}
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

   
        <Tool
          icon="list-outline"
          label={isArabic ? "مبسط" : "Simple"}
          hint={
            isArabic
              ? "تبسيط الإجابات إلى نقاط"
              : "Simplify responses into bullet points"
          }
          onPress={toggleSimpleMode}
          colors={colors}
          active={simpleMode}
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

        <Tool
          icon="text-outline"
          label={isArabic ? "خط سهل" : "Dyslexia Font"}
          hint={
            isArabic
              ? "استخدام خط مناسب لعسر القراءة"
              : "Use a dyslexia friendly font"
          }
          onPress={toggleDyslexiaFont}
          colors={colors}
          active={dyslexiaFont}
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

        <Tool
          icon="resize-outline"
          label={isArabic ? "تباعد النص" : "Spacing"}
          hint={
            isArabic
              ? "زيادة المسافات بين الحروف والأسطر"
              : "Increase letter and line spacing"
          }
          onPress={toggleDyslexiaSpacing}
          colors={colors}
          active={dyslexiaSpacing}
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

        <Tool
          icon="scan-outline"
          label={isArabic ? "تركيز" : "Focus"}
          hint={
            isArabic
              ? "إخفاء المشتتات للتركيز على القراءة"
              : "Hide distractions and focus on reading"
          }
          onPress={toggleFocusMode}
          colors={colors}
          active={focusMode}
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

        <Tool
          icon="hand-left-outline"
          label={isArabic ? "لمس سهل" : "Easy Tap"}
          hint={
            isArabic
              ? "يكبر الأزرار قليلًا ويزيد المسافات لتقليل اللمسات الخاطئة"
              : "Makes buttons easier to press and adds spacing to reduce accidental taps"
          }
          onPress={toggleEasyTapMode}
          colors={colors}
          active={easyTapMode}
          accessibilityLabel={
            isArabic ? "تبديل وضع اللمس السهل" : "Toggle easy tap mode"
          }
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

        <Tool
          icon="add-outline"
          label={isArabic ? "تكبير" : "Larger"}
          hint={
            isArabic
              ? "تكبير حجم النص"
              : "Increase font size"
          }
          onPress={increaseFont}
          colors={colors}
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

        <Tool
          icon="remove-outline"
          label={isArabic ? "تصغير" : "Smaller"}
          hint={
            isArabic
              ? "تصغير حجم النص"
              : "Decrease font size"
          }
          onPress={decreaseFont}
          colors={colors}
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

        <Tool
          icon="color-filter-outline"
          label={
            isArabic
              ? grayscaleEnabled
                ? "إيقاف الأبيض والأسود"
                : "تشغيل الأبيض والأسود"
              : grayscaleEnabled
              ? "Disable B&W"
              : "Enable B&W"
          }
          hint={
            isArabic
              ? "تشغيل أو إيقاف وضع الأبيض والأسود"
              : "Turn black and white mode on or off"
          }
          onPress={() => {
            const next = !grayscaleEnabled;
            toggleGrayscale();
            AccessibilityInfo.announceForAccessibility(
              isArabic
                ? next
                  ? "تم تشغيل الأبيض والأسود"
                  : "تم إيقاف الأبيض والأسود"
                : next
                ? "Black and white mode enabled"
                : "Black and white mode disabled"
            );
          }}
          colors={colors}
          accessibilityLabel={
            isArabic
              ? "تبديل وضع الأبيض والأسود"
              : "Toggle black and white mode"
          }
          active={grayscaleEnabled}
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

        <Tool
          icon="refresh-outline"
          label={isArabic ? "إعادة ضبط" : "Reset"}
          hint={
            isArabic
              ? "إعادة جميع إعدادات الوصول للوضع الافتراضي"
              : "Reset all accessibility settings"
          }
          onPress={resetAccessibility}
          colors={colors}
          toolMinHeight={toolMinHeight}
          toolSpacing={toolSpacing}
          toolPaddingY={toolPaddingY}
          hitSlop={controlHitSlop}
        />

      </View>

      {/* CONTRAST CONTROL */}

      <Contrast
        colors={colors}
        contrastLevel={contrastLevel}
        setContrastLevel={setContrastLevel}
        contrastSets={contrastSets}
        t={t}
        announce={announce}
        styles={styles}
        isArabic={isArabic}
      />
    </View>
  );
}

/* TOOL BUTTON */

function Tool({
  icon,
  label,
  hint,
  onPress,
  colors,
  accessibilityLabel,
  active,
  toolMinHeight,
  toolSpacing,
  toolPaddingY,
  hitSlop,
}: any) {
  return (
    <Pressable
      style={({ pressed }) => [
        toolStyle,
        {
          minHeight: toolMinHeight ?? toolStyle.minHeight,
          marginBottom: toolSpacing ?? toolStyle.marginBottom,
          paddingVertical: toolPaddingY ?? toolStyle.paddingVertical,
        },
        {
          backgroundColor: active ? colors.accent : NEUTRAL.white,
          borderColor: active ? colors.accent : colors.line,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={hint}
      accessibilityState={active ? { selected: true } : undefined}
      hitSlop={hitSlop ?? HIT_SLOP}
    >
      <Ionicons
        name={icon}
        size={DESIGN_ICON_SIZE.xl}
        color={active ? NEUTRAL.white : colors.accent}
      />
      <Text style={[toolText, { color: active ? NEUTRAL.white : colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

/* STYLES */

const gridStyle = {
  flexDirection: "row" as const,
  flexWrap: "wrap" as const,
  marginBottom: SPACING.section,
  justifyContent: "space-between" as const,
};

const toolStyle = {
  width: "31%" as const,
  minHeight: 84,
  marginBottom: CONTROL_SPACING,
  borderRadius: CONTROL_RADIUS,
  borderWidth: BORDER_WIDTH.thin,
  paddingHorizontal: CONTROL_PADDING,
  paddingVertical: SPACING.section,
  justifyContent: "center" as const,
  alignItems: "center" as const,
};

const toolText = {
  marginTop: SPACING.xs + 2,
  fontSize: FONT_SIZE.xs,
  fontWeight: "600" as const,
  textAlign: "center" as const,
  flexWrap: "wrap" as const,
  width: "100%" as const,
};
