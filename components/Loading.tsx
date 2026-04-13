import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { FONT_SIZE, NEUTRAL, SPACING } from "@/constants/design";

type Props = {
  label?: string;
};

export default function LoadingSpinner({
  label = "Loading",
}: Props) {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator
        size="small"
        style={styles.spinner}
        color="#00674F"
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    transform: [{ scaleX: 2 }, { scaleY: 2 }],
  },
  label: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: "#00674F",
    fontWeight: "600",
  },
});
