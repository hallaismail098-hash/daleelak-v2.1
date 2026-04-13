import React from "react";
import { View, Text, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BORDER_WIDTH,
  FONT_SIZE,
  ICON_SIZE,
  RADIUS,
  SPACING,
} from "@/constants/design";

type Props = {
  isArabic: boolean;
  colors: any;
};

export default function HelpPanel({ isArabic, colors }: Props) {

  const Row = ({ icon, title, description }: any) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: SPACING.sm,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.card,
          justifyContent: "center",
          alignItems: "center",
          marginEnd: SPACING.sm,
        }}
      >
        <Ionicons name={icon} size={ICON_SIZE.sm} color={colors.accent} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: FONT_SIZE.md,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 2,
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: FONT_SIZE.sm,
            lineHeight: 17,
            color: colors.text,
            opacity: 0.85,
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={{ maxHeight: 350 }}
      contentContainerStyle={{
        borderWidth: BORDER_WIDTH.thin,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.section,
        backgroundColor: colors.hintPanel,
        borderColor: colors.line,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: SPACING.section,
        }}
      >
        <Ionicons
          name="information-circle-outline"
          size={ICON_SIZE.lg}
          color={colors.accent}
        />
        <Text
          style={{
            fontSize: FONT_SIZE.base,
            fontWeight: "700",
            marginStart: SPACING.xs + 2,
            color: colors.text,
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {isArabic ? "كيفية استخدام الأدوات" : "How to use the tools"}
        </Text>
      </View>

      {/* ACCESSIBILITY TOOLS */}

      <Row
        icon="volume-high-outline"
        title={isArabic ? "الصوت" : "Voice"}
        description={
          isArabic
            ? "يقوم بقراءة ردود المساعد بصوت واضح."
            : "Reads chatbot responses aloud."
        }
      />



      <Row
        icon="list-outline"
        title={isArabic ? "الوضع المبسط" : "Simple Mode"}
        description={
          isArabic
            ? "يعرض الردود الطويلة كنقاط مختصرة."
            : "Shows long responses as bullet points."
        }
      />

      <Row
        icon="school-outline"
        title={isArabic ? "وضع عسر القراءة" : "Dyslexia Mode"}
        description={
          isArabic
            ? "يجعل النص أسهل للقراءة للأشخاص الذين يعانون من عسر القراءة."
            : "Provides an easier layout for dyslexia."
        }
      />

      <Row
        icon="scan-outline"
        title={isArabic ? "وضع التركيز" : "Focus Mode"}
        description={
          isArabic
            ? "يقلل عناصر الواجهة للمساعدة على التركيز."
          : "Reduces interface distractions."
        }
      />

      <Row
        icon="hand-left-outline"
        title={isArabic ? "وضع اللمس السهل" : "Easy Tap Mode"}
        description={
          isArabic
            ? "يجعل الأزرار أسهل للضغط ويزيد المسافات لتقليل اللمسات الخاطئة."
            : "Makes buttons easier to press, adds spacing, and helps reduce accidental taps."
        }
      />

      <Row
        icon="contrast-outline"
        title={isArabic ? "التباين" : "Contrast"}
        description={
          isArabic
            ? "تغيير الألوان لتحسين الرؤية."
            : "Adjusts colors to improve visibility."
        }
      />

      {/* VOICE COMMANDS */}

      <View
        style={{
          marginTop: SPACING.md,
          paddingTop: SPACING.section,
          borderTopWidth: BORDER_WIDTH.thin,
          borderTopColor: colors.line,
        }}
      >
        <Text
          style={{
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            marginBottom: SPACING.sm,
            color: colors.text,
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {isArabic ? "الأوامر الصوتية" : "Voice commands"}
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {(isArabic
            ? [
                ["افتح الوصول", "فتح لوحة الوصول"],
                ["اغلق الوصول", "إغلاق لوحة الوصول"],
                ["ارسل الرسالة", "إرسال الرسالة"],
                ["تكبير الخط", "زيادة حجم النص"],
                ["تصغير الخط", "تقليل حجم النص"],
                ["وضع القراءة", "تحسين القراءة"],
                ["الوضع المبسط", "تبسيط الردود"],
                ["خط عسر القراءة", "خط مخصص لعسر القراءة"],
                ["تباعد السطور", "زيادة المسافات"],
                ["قارئ الشاشة", "قراءة النص بصوت"],
                ["تباين عالي", "زيادة التباين"],
                ["تباين متوسط", "تباين متوسط"],
                ["تباين منخفض", "تباين منخفض"],
                ["إعادة الضبط", "إعادة الإعدادات"],
              ]
            : [
                ["open access", "Open accessibility panel"],
                ["close access", "Close accessibility panel"],
                ["send message", "Send message"],
                ["increase font", "Increase text size"],
                ["decrease font", "Decrease text size"],
            
                ["simple mode", "Simplify answers"],
                ["dyslexia font", "Dyslexia friendly font"],
                ["line spacing", "Increase line spacing"],
                ["screen reader", "Read responses aloud"],
                ["high contrast", "Maximum visibility"],
                ["medium contrast", "Balanced contrast"],
                ["low contrast", "Default contrast"],
                ["reset accessibility", "Restore settings"],
              ]
          ).map(([cmd, desc], i) => (
            <View
              key={i}
              style={{
                width: "32%",
                backgroundColor: colors.card,
                borderRadius: RADIUS.sm,
                borderWidth: BORDER_WIDTH.thin,
                borderColor: colors.line,
                paddingVertical: SPACING.sm,
                paddingHorizontal: SPACING.xs + 2,
                marginBottom: SPACING.sm,
              }}
            >
              <Text
                style={{
                  fontSize: FONT_SIZE.sm,
                  fontWeight: "700",
                  color: colors.accent,
                  marginBottom: 2,
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {cmd}
              </Text>

              <Text
                style={{
                  fontSize: FONT_SIZE.xs,
                  color: colors.text,
                  opacity: 0.85,
                  lineHeight: 15,
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {desc}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
