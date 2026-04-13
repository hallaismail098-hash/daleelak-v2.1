import React from "react";
import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ICON_SIZE, NEUTRAL } from "@/constants/design";
import { HIT_SLOP } from "@/constants/interaction";

type Props = {
  colors: any;
  contrastLevel: number;
  setContrastLevel: (level: number) => void;
  contrastSets: any[];
  t: any;
  announce: (text: string) => void;
  styles: any;
  isArabic: boolean;
};

export default function ContrastSlider({
  colors,
  contrastLevel,
  setContrastLevel,
  contrastSets,
  t,
  announce,
  styles,
  isArabic,
}: Props) {
  return (
    <View
      style={[
        styles.sliderCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.line,
        },
      ]}
      accessibilityRole="radiogroup"
      accessibilityLabel={isArabic ? "مستوى التباين" : "Contrast level"}
      accessibilityHint={
        isArabic
          ? "اختر مستوى التباين المناسب"
          : "Choose the contrast level"
      }
    >
      <View style={styles.sliderHeader}>
        <View style={styles.sliderTitleWrap}>
          <Ionicons
            name="contrast-outline"
            size={ICON_SIZE.sm}
            color={colors.accent}
          />
          <Text style={[styles.sliderTitle, { color: colors.text }]}>
            {t("contrast")}
          </Text>
        </View>

        <Text style={[styles.sliderValue, { color: colors.accent }]}>
          {t(`contrastLevels.${colors.labelKey}`)}
        </Text>
      </View>

      <View style={styles.sliderTrackWrap}>
        <View
          style={[styles.sliderTrack, { backgroundColor: colors.line }]}
        />

        <View style={styles.sliderSteps}>
          {[0, 1, 2].map((level) => {
            const active = contrastLevel >= level;
            const selected = contrastLevel === level;

            return (
              <Pressable
                key={level}
                onPress={() => {
                  setContrastLevel(level);
                  announce(
                    `${t("contrast")} ${t(
                      `contrastLevels.${contrastSets[level].labelKey}`
                    )}`
                  );
                }}
                style={({ pressed }) => [
                  styles.sliderStepButton,
                  { opacity: pressed ? 0.82 : 1 },
                ]}
                accessibilityRole="radio"
                accessibilityLabel={`${t("contrast")} ${t(
                  `contrastLevels.${contrastSets[level].labelKey}`
                )}`}
                accessibilityHint={
                  isArabic
                    ? "اضغط لاختيار هذا المستوى"
                    : "Tap to select this level"
                }
                accessibilityState={{ checked: selected, selected }}
                hitSlop={HIT_SLOP}
              >
                <View
                  style={[
                    styles.sliderDot,
                    {
                      backgroundColor: active ? colors.accent : NEUTRAL.white,
                      borderColor: colors.accent,
                      transform: [{ scale: selected ? 1.08 : 1 }],
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.sliderLabels}>
        <Text style={[styles.sliderLabel, { color: colors.text }]}>
          {t("contrastLevels.low")}
        </Text>
        <Text style={[styles.sliderLabel, { color: colors.text }]}>
          {t("contrastLevels.medium")}
        </Text>
        <Text style={[styles.sliderLabel, { color: colors.text }]}>
          {t("contrastLevels.high")}
        </Text>
      </View>
    </View>
  );
}
