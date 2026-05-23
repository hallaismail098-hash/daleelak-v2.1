import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BORDER_WIDTH,
  FONT_SIZE,
  NEUTRAL,
  SCREEN_EDGE,
  SPACING,
} from "@/constants/design";
import {
  COMPACT_TOUCH_TARGET,
  CONTROL_PADDING,
  HIT_SLOP,
  ICON_SIZE,
  PILL_RADIUS,
  TOP_BAR_CONTROL_GAP,
  TOP_BAR_GROUP_GAP,
  TOP_BAR_SAFE_PADDING,
  TOUCH_TARGET,
} from "@/constants/interaction";

type Props = {
  isArabic: boolean;
  colors: any;
  drawerOpen: boolean;
  tutorialActive: boolean;
  easyTapMode: boolean;
  toggleDrawer: () => void;
  toggleLanguage: () => void;
  onStartTutorial: () => void;
  onGoHome: () => void;
  onRefresh: () => void;
  onStartNewMessage: () => void;
};

export default function TopBar({
  isArabic,
  colors,
  drawerOpen,
  tutorialActive,
  easyTapMode,
  toggleDrawer,
  toggleLanguage,
  onStartTutorial,
  onGoHome,
  onRefresh,
  onStartNewMessage,
}: Props) {
  const touchTarget = easyTapMode ? TOUCH_TARGET + 6 : TOUCH_TARGET;
  const compactTouchTarget = easyTapMode
    ? COMPACT_TOUCH_TARGET + 4
    : COMPACT_TOUCH_TARGET;
  const controlPadding = easyTapMode ? CONTROL_PADDING + 2 : CONTROL_PADDING;
  const hitSlop = easyTapMode
    ? { top: 10, bottom: 10, left: 10, right: 10 }
    : HIT_SLOP;
  const languageLabel = isArabic ? "English" : "العربية";
  const accessibilityLabel = isArabic ? "الوصول" : "Accessibility";

  const ActionButton = ({
    icon,
    label,
    onPress,
    active,
    expanded,
    compact,
    showLabel,
    labelDirection,
    maxWidth,
    isLast,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    active?: boolean;
    expanded?: boolean;
    compact?: boolean;
    showLabel?: boolean;
    labelDirection?: "ltr" | "rtl";
    maxWidth?: number;
    isLast?: boolean;
  }) => {
    const height = compact ? compactTouchTarget : touchTarget;
    const foreground = active ? NEUTRAL.white : colors.accent;

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.buttonBase,
          {
            height,
            minWidth: height,
            paddingHorizontal: compact ? controlPadding - 2 : controlPadding - 4,
            backgroundColor: active ? colors.accent : colors.card,
            borderColor: active ? colors.accent : colors.line,
            marginEnd: isLast ? 0 : TOP_BAR_CONTROL_GAP,
            opacity: pressed ? 0.82 : 1,
          },
          compact && styles.compactButton,
          showLabel && styles.labelButton,
          showLabel && maxWidth ? { maxWidth } : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={
          expanded === undefined ? undefined : { expanded }
        }
        hitSlop={hitSlop}
      >
        <Ionicons name={icon} size={ICON_SIZE - 1} color={foreground} />
        {showLabel ? (
          <Text
            style={[
              styles.buttonLabel,
              {
                color: foreground,
                writingDirection: labelDirection,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {label}
          </Text>
        ) : null}
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.topBar,
        {
          paddingTop: TOP_BAR_SAFE_PADDING,
          borderBottomColor: colors.line,
          backgroundColor: colors.background,
        },
      ]}
      accessibilityRole="toolbar"
      accessibilityLabel={isArabic ? "شريط الأدوات" : "Toolbar"}
    >
      <View style={styles.leftGroup}>
        <ActionButton
          icon={tutorialActive ? "help-circle" : "help-circle-outline"}
          label={isArabic ? "مساعدة" : "Help"}
          onPress={onStartTutorial}
          active={tutorialActive}
        />
        <ActionButton
          icon="refresh-outline"
          label={isArabic ? "تحديث" : "Refresh"}
          onPress={onRefresh}
        />
        <ActionButton
          icon="home-outline"
          label={isArabic ? "الرئيسية" : "Home"}
          onPress={onGoHome}
        />
        <ActionButton
          icon="add-circle-outline"
          label={isArabic ? "رسالة جديدة" : "New Message"}
          onPress={onStartNewMessage}
          isLast
        />
      </View>

      <View style={styles.rightGroup}>
        <ActionButton
          icon="globe-outline"
          label={languageLabel}
          onPress={toggleLanguage}
          compact
          showLabel
          labelDirection={isArabic ? "ltr" : "rtl"}
          maxWidth={120}
        />
        <ActionButton
          icon={drawerOpen ? "close-outline" : "accessibility-outline"}
          label={accessibilityLabel}
          onPress={toggleDrawer}
          active={drawerOpen}
          expanded={drawerOpen}
          compact
          isLast
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SCREEN_EDGE.horizontal,
    paddingBottom: SPACING.sm + 2,
    borderBottomWidth: BORDER_WIDTH.thin,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
    marginEnd: TOP_BAR_GROUP_GAP,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    minWidth: 0,
    marginStart: TOP_BAR_GROUP_GAP,
  },
  buttonBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: BORDER_WIDTH.thin,
    borderRadius: PILL_RADIUS,
  },
  compactButton: {
    flexShrink: 0,
  },
  labelButton: {
    flexShrink: 1,
    minWidth: 0,
  },
  buttonLabel: {
    marginStart: SPACING.xs + 2,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    includeFontPadding: false,
    textAlign: "auto",
    flexShrink: 1,
  },
});
