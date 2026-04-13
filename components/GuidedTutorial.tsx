import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {
  BORDER_WIDTH,
  FONT_SIZE,
  NEUTRAL,
  RADIUS,
  SCREEN_EDGE,
  SHADOW,
  SPACING,
} from "@/constants/design";
import {
  COMPACT_TOUCH_TARGET,
  CONTROL_RADIUS,
  CONTROL_SPACING,
  HIT_SLOP,
} from "@/constants/interaction";

type TutorialStep = {
  title: string;
  description: string;
  placement: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
};

type Props = {
  visible: boolean;
  colors: any;
  isArabic: boolean;
  stepIndex: number;
  steps: TutorialStep[];
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  onDone: () => void;
};

export default function GuidedTutorial({
  visible,
  colors,
  isArabic,
  stepIndex,
  steps,
  onBack,
  onNext,
  onSkip,
  onDone,
}: Props) {
  if (!visible || !steps.length) return null;

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const placementStyle = getPlacementStyle(step.placement);

  return (
    <View style={styles.overlay} accessibilityViewIsModal>
      <View style={styles.dimmedBackground} />

      <View
        style={[
          styles.card,
          placementStyle,
          {
            backgroundColor: colors.panel,
            borderColor: colors.line,
          },
        ]}
      >
        <Text style={[styles.stepCounter, { color: colors.accent }]}>
          {isArabic
            ? `الخطوة ${stepIndex + 1} من ${steps.length}`
            : `Step ${stepIndex + 1} of ${steps.length}`}
        </Text>

        <Text
          style={[
            styles.title,
            { color: colors.text, textAlign: isArabic ? "right" : "left" },
          ]}
        >
          {step.title}
        </Text>

        <Text
          style={[
            styles.description,
            { color: colors.text, textAlign: isArabic ? "right" : "left" },
          ]}
        >
          {step.description}
        </Text>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: colors.line, opacity: pressed ? 0.82 : 1 },
            ]}
            onPress={onSkip}
            accessibilityRole="button"
            accessibilityLabel={isArabic ? "تخطي" : "Skip"}
            hitSlop={HIT_SLOP}
          >
            <Text style={[styles.secondaryText, { color: colors.text }]}>
              {isArabic ? "تخطي" : "Skip"}
            </Text>
          </Pressable>

          <View style={styles.primaryActions}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: colors.line,
                  opacity: stepIndex === 0 ? 0.55 : pressed ? 0.82 : 1,
                },
              ]}
              onPress={onBack}
              disabled={stepIndex === 0}
              accessibilityRole="button"
              accessibilityLabel={isArabic ? "السابق" : "Back"}
              hitSlop={HIT_SLOP}
            >
              <Text
                style={[
                  styles.secondaryText,
                  {
                    color: stepIndex === 0 ? `${colors.text}66` : colors.text,
                  },
                ]}
              >
                {isArabic ? "السابق" : "Back"}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: colors.accent, opacity: pressed ? 0.88 : 1 },
              ]}
              onPress={isLastStep ? onDone : onNext}
              accessibilityRole="button"
              accessibilityLabel={isLastStep ? (isArabic ? "إنهاء" : "Done") : isArabic ? "التالي" : "Next"}
              hitSlop={HIT_SLOP}
            >
              <Text style={styles.primaryText}>
                {isLastStep
                  ? isArabic
                    ? "إنهاء"
                    : "Done"
                  : isArabic
                  ? "التالي"
                  : "Next"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function getPlacementStyle(
  placement: TutorialStep["placement"],
): Record<string, number> {
  switch (placement) {
    case "topRight":
      return { top: 90, right: SCREEN_EDGE.horizontal };
    case "bottomLeft":
      return { bottom: 132, left: SCREEN_EDGE.horizontal };
    case "bottomRight":
      return { bottom: 132, right: SCREEN_EDGE.horizontal };
    case "topLeft":
    default:
      return { top: 90, left: SCREEN_EDGE.horizontal };
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3000,
  },
  dimmedBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: NEUTRAL.overlaySoft,
  },
  card: {
    position: "absolute",
    width: 260,
    borderWidth: BORDER_WIDTH.thin,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  stepCounter: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "700",
    marginBottom: SPACING.xs + 2,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    marginBottom: SPACING.xs + 2,
  },
  description: {
    fontSize: FONT_SIZE.md,
    lineHeight: 19,
  },
  actions: {
    marginTop: SPACING.md + 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryButton: {
    minHeight: COMPACT_TOUCH_TARGET,
    paddingHorizontal: SPACING.section,
    borderRadius: CONTROL_RADIUS,
    borderWidth: BORDER_WIDTH.thin,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: CONTROL_SPACING,
  },
  secondaryText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  primaryButton: {
    minHeight: COMPACT_TOUCH_TARGET,
    paddingHorizontal: SPACING.md + 2,
    borderRadius: CONTROL_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: CONTROL_SPACING,
  },
  primaryText: {
    color: NEUTRAL.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
});
