import React from "react";
import { View, Pressable, Text } from "react-native";
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
  CONTROL_SPACING,
  HIT_SLOP,
  ICON_SIZE,
  PILL_RADIUS,
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
  const groupStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flexShrink: 1,
  };
  const touchTarget = easyTapMode ? TOUCH_TARGET + 6 : TOUCH_TARGET;
  const compactTouchTarget = easyTapMode
    ? COMPACT_TOUCH_TARGET + 4
    : COMPACT_TOUCH_TARGET;
  const controlPadding = easyTapMode ? CONTROL_PADDING + 2 : CONTROL_PADDING;
  const controlSpacing = easyTapMode ? CONTROL_SPACING + 4 : CONTROL_SPACING;
  const hitSlop = easyTapMode
    ? { top: 10, bottom: 10, left: 10, right: 10 }
    : HIT_SLOP;

  const labelStyle = {
    marginStart: SPACING.xs + 2,
    fontWeight: "600" as const,
    fontSize: FONT_SIZE.sm,
    color: colors.accent,
  };

  const IconButton = ({
    icon,
    onPress,
    label,
    expanded,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label: string;
    expanded?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minWidth: touchTarget,
        height: touchTarget,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: expanded ? colors.accent : colors.card,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: expanded ? colors.accent : colors.line,
        paddingHorizontal: controlPadding,
        borderRadius: PILL_RADIUS,
        marginRight: controlSpacing,
        opacity: pressed ? 0.8 : 1,
      })}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={expanded === undefined ? undefined : { expanded }}
      hitSlop={hitSlop}
    >
      <Ionicons
        name={icon}
        size={ICON_SIZE}
        color={expanded ? NEUTRAL.white : colors.accent}
      />
    </Pressable>
  );

  const CompactButton = ({
    icon,
    label,
    onPress,
    expanded,
    disabled,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    expanded?: boolean;
    disabled?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        minHeight: compactTouchTarget,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: expanded ? colors.accent : colors.card,
        borderWidth: BORDER_WIDTH.thin,
        borderColor: expanded ? colors.accent : colors.line,
        paddingHorizontal: controlPadding,
        borderRadius: PILL_RADIUS,
        marginLeft: controlSpacing,
        opacity: disabled ? 0.5 : pressed ? 0.82 : 1,
      })}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        ...(expanded === undefined ? {} : { expanded }),
        ...(disabled ? { disabled: true } : {}),
      }}
      hitSlop={hitSlop}
    >
      <Ionicons
        name={icon}
        size={ICON_SIZE}
        color={expanded ? NEUTRAL.white : colors.accent}
      />
      <Text
        style={[
          labelStyle,
          { color: expanded ? NEUTRAL.white : colors.accent },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View
      style={{
        paddingHorizontal: SCREEN_EDGE.horizontal,
        paddingTop: SPACING.section,
        paddingBottom: SPACING.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: BORDER_WIDTH.thin,
        borderBottomColor: colors.line,
      }}
      accessibilityRole="toolbar"
      accessibilityLabel={isArabic ? "شريط الأدوات" : "Toolbar"}
    >
      <View style={[groupStyle, { marginRight: controlSpacing + 4 }]}>
        <IconButton
          icon={tutorialActive ? "help-circle" : "help-circle-outline"}
          label={isArabic ? "مساعدة" : "Help"}
          onPress={onStartTutorial}
          expanded={tutorialActive}
        />
        <IconButton
          icon="refresh-outline"
          label={isArabic ? "تحديث" : "Refresh"}
          onPress={onRefresh}
        />
        <IconButton
          icon="home-outline"
          label={isArabic ? "الرئيسية" : "Home"}
          onPress={onGoHome}
        />
        <CompactButton
          icon="add-circle-outline"
          label={isArabic ? "رسالة جديدة" : "New Message"}
          onPress={onStartNewMessage}
        />
      </View>

      <View style={groupStyle}>
        <CompactButton
          icon="globe-outline"
          label={isArabic ? "English" : "العربية"}
          onPress={toggleLanguage}
        />
        <CompactButton
          icon={drawerOpen ? "close-outline" : "options-outline"}
          label={isArabic ? "الوصول" : "Access"}
          onPress={toggleDrawer}
          expanded={drawerOpen}
        />
      </View>
    </View>
  );
}
