import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  AccessibilityInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import { BUTTON_HEIGHT, BORDER_WIDTH, NEUTRAL, RADIUS, SCREEN_EDGE, SPACING } from "@/constants/design";
import { HIT_SLOP } from "@/constants/interaction";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

export default function IntroScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { i18n } = useTranslation();

  const [currentScreen, setCurrentScreen] = useState(0);
  const [showDotsHint, setShowDotsHint] = useState(false);

  const isArabic = i18n.language === "ar";

  const slides = [
    isArabic
      ? '"دليلك" يوفر لك الوصول السريع للخدمات الحكومية في الأردن.'
      : '"Daleelak" gives you quick access to government services in Jordan.',
    isArabic
      ? "فقط أدخل استفسارك وسندعمك بإرشادات وخطوات لإنجاز معاملتك."
      : "Just enter your question and we will guide you with steps to complete your service.",
    isArabic
      ? "كل ما تحتاج لمعرفته عن الخدمات الحكومية أصبح بين يديك!"
      : "Everything you need to know about government services is now at your fingertips!",
  ];

  useEffect(() => {
    StatusBar.setHidden(true);
    AccessibilityInfo.announceForAccessibility(
      isArabic
        ? "مرحباً بك في مقدمة تطبيق دليلك"
        : "Welcome to Daleelak introduction"
    );
    return () => StatusBar.setHidden(false);
  }, [isArabic]);

  const Tooltip = ({ text }: { text: string }) => (
    <View
      style={{
        position: "absolute",
        bottom: 70,
        backgroundColor: "#333",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        zIndex: 999,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 12 }}>{text}</Text>
    </View>
  );

  const announcePage = (page: number) => {
    AccessibilityInfo.announceForAccessibility(
      isArabic ? `الصفحة ${page + 1} من 3` : `Page ${page + 1} of 3`
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    if (page !== currentScreen) {
      setCurrentScreen(page);
      announcePage(page);
    }
  };

  const goToPage = (page: number) => {
    if (page < 0 || page > 2) return;
    scrollRef.current?.scrollTo({
      x: page * width,
      animated: true,
    });
    setCurrentScreen(page);
    announcePage(page);
  };

  const goNext = () => {
    if (currentScreen < 2) {
      goToPage(currentScreen + 1);
    }
  };

  const handleStart = () => {
    AccessibilityInfo.announceForAccessibility(
      isArabic ? "جاري فتح شاشة المحادثة" : "Opening chat screen"
    );
    router.push("/intoScreen");
  };

  const toggleLanguage = async () => {
    const next = isArabic ? "en" : "ar";
    await i18n.changeLanguage(next);
    AccessibilityInfo.announceForAccessibility(
      next === "ar" ? "تم تغيير اللغة إلى العربية" : "Language changed to English"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={styles.topBar}
        accessibilityRole="toolbar"
        accessibilityLabel={isArabic ? "شريط الأدوات" : "Toolbar"}
      >
        <TouchableOpacity
          style={styles.langButton}
          onPress={toggleLanguage}
          accessibilityRole="button"
          accessibilityLabel={isArabic ? "تغيير اللغة" : "Change language"}
        >
          <Ionicons name="globe-outline" size={20} color="#004030" />
          <Text style={styles.langButtonText}>
            {isArabic ? "English" : "العربية"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel={
          isArabic
            ? "شرائح المقدمة. يمكنك السحب أو النقر للانتقال"
            : "Introduction slides. You can swipe or tap to continue"
        }
      >
        {[0, 1, 2].map((index) => {
          const isLast = index === 2;

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={styles.screen}
              onPress={!isLast ? goNext : undefined}
              accessibilityRole="summary"
              accessibilityLabel={
                isArabic
                  ? `شريحة ${index + 1} من 3. ${slides[index]}`
                  : `Slide ${index + 1} of 3. ${slides[index]}`
              }
            >
              <View style={styles.logoRectangle}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.icon}
                />
              </View>

              <Text style={styles.description}>{slides[index]}</Text>

              {isLast && (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStart}
                  accessibilityRole="button"
                  accessibilityLabel={isArabic ? "ابدأ" : "Start"}
                >
                  <Text style={styles.startButtonText}>
                    {isArabic ? "ابدأ!" : "Start!"}
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View
        style={styles.progressDots}
        accessibilityRole="text"
        accessibilityLabel={
          isArabic
            ? `الصفحة ${currentScreen + 1} من 3`
            : `Page ${currentScreen + 1} of 3`
        }
      >
        {showDotsHint && (
          <Tooltip
            text={
              isArabic
                ? "اسحب أو اضغط للتنقل"
                : "Swipe or tap to navigate"
            }
          />
        )}

        {[0, 1, 2].map((i) => (
          <TouchableOpacity
            key={i}
            style={styles.dotButton}
            onPress={() => goToPage(i)}
            onLongPress={() => setShowDotsHint(true)}
            onPressOut={() => setShowDotsHint(false)}
            {...(Platform.OS === "web"
              ? {
                  onMouseEnter: () => setShowDotsHint(true),
                  onMouseLeave: () => setShowDotsHint(false),
                }
              : {})}
            accessibilityRole="button"
            accessibilityLabel={
              isArabic
                ? `اذهب إلى الصفحة ${i + 1}`
                : `Go to page ${i + 1}`
            }
            accessibilityState={{ selected: currentScreen === i }}
            hitSlop={HIT_SLOP}
          >
            <View
              style={[
                styles.dot,
                currentScreen === i && styles.activeDot,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#004030",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: SCREEN_EDGE.horizontal,
    paddingTop: SPACING.sm,
  },

  langButton: {
    minWidth: BUTTON_HEIGHT.compact,
    minHeight: BUTTON_HEIGHT.compact,
    backgroundColor: NEUTRAL.white,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  langButtonText: {
    color: "#004030",
    marginLeft: 6,
    fontWeight: "600",
  },

  screen: {
    width,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  logoRectangle: {
    width: 260,
    height: 260,
    backgroundColor: "white",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    width: 240,
    height: 240,
    resizeMode: "contain",
  },

  description: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 25,
    lineHeight: 28,
    maxWidth: 320,
  },

  startButton: {
    marginTop: 30,
    minWidth: 120,
    minHeight: 48,
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  startButtonText: {
    color: "#004030",
    fontSize: 20,
    fontWeight: "600",
  },

  progressDots: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  dotButton: {
    width: BUTTON_HEIGHT.compact,
    height: BUTTON_HEIGHT.compact,
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: BORDER_WIDTH.thin,
    borderColor: NEUTRAL.white,
    marginHorizontal: SPACING.xs,
  },

  activeDot: {
    backgroundColor: NEUTRAL.white,
  },
});
