import {
  StyleSheet,
  Platform,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Text,
  Alert,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";

import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import LoadingSpinner from "@/components/Loading";
import TopBar from "@/components/TopBar";
import Drawer from "@/components/Drawer";
import ChatInput from "@/components/chatInput";
import GuidedTutorial from "@/components/GuidedTutorial";
import MessageBubble from "@/components/MessageBubble";
import * as Font from "expo-font";
import { useGrayscale } from "@/context/GrayscaleContext";
import { mapColorsToGrayscale } from "@/utils/grayscale";
import {
  COMPACT_TOUCH_TARGET,
  CONTROL_PADDING,
  CONTROL_SPACING,
  PILL_RADIUS,
  TOUCH_TARGET,
} from "@/constants/interaction";
import {
  BORDER_WIDTH,
  FONT_SIZE,
  NEUTRAL,
  RADIUS,
  SCREEN_EDGE,
  SPACING,
} from "@/constants/design";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import Ionicons from "@expo/vector-icons/Ionicons";
import * as Speech from "expo-speech";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";


const apiKey = process.env.EXPO_PUBLIC_API_KEY;
console.log("ENV CHECK:", process.env.EXPO_PUBLIC_API_KEY);
const OPENAI_BASE_URL = "https://api.openai.com/v1";

type ChatMessage = {
  isCurrentUser: boolean;
  message: string;
};

export default function MainScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [assistant, setAssistant] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);
  const [openai, setOpenai] = useState<any>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [dyslexiaSpacing, setDyslexiaSpacing] = useState(false);
  const toggleDyslexiaFont = () => setDyslexiaFont((v) => !v);
  const toggleDyslexiaSpacing = () => setDyslexiaSpacing((v) => !v);
  const [fontScale, setFontScale] = useState(1);
  const [contrastLevel, setContrastLevel] = useState(0);

  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [readerMode, setReaderMode] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [easyTapMode, setEasyTapMode] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [isListening, setIsListening] = useState(false);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  const [currentImage, setCurrentImage] = useState(
    require("@/assets/images/logo.png"),
  );

  const chatScrollRef = useRef<ScrollView>(null);
  const messageInputRef = useRef<TextInput>(null);
  const heroTitleRef = useRef<View>(null);
  const speechEnabledRef = useRef(false);
  const previousLoadingRef = useRef(false);

  const isArabic = i18n.language?.startsWith("ar");
  const { grayscaleEnabled, setGrayscaleEnabled } = useGrayscale();
  const contrastSets = [
    {
      labelKey: "low",
      background: "#FFFFFF",
      text: "#004030",
      bubble: "#004030",
      bubbleText: "#FFFFFF",
      input: "#004030",
      inputText: "#FFFFFF",
      card: "#F5F7F6",
      line: "#CFE0D9",
      accent: "#00674F",
      panel: "#F7FAF8",
      hintPanel: "#EEF7F2",
    },
    {
      labelKey: "medium",
      background: "#F7FAF8",
      text: "#003628",
      bubble: "#003628",
      bubbleText: "#FFFFFF",
      input: "#003628",
      inputText: "#FFFFFF",
      card: "#EEF4F1",
      line: "#BFD4CB",
      accent: "#005A45",
      panel: "#EEF4F1",
      hintPanel: "#E7F0EC",
    },
    {
      labelKey: "high",
      background: "#FFFFFF",
      text: "#000000",
      bubble: "#000000",
      bubbleText: "#FFFFFF",
      input: "#000000",
      inputText: "#FFFFFF",
      card: "#F2F2F2",
      line: "#BDBDBD",
      accent: "#000000",
      panel: "#F5F5F5",
      hintPanel: "#F0F0F0",
    },
  ];
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        OpenDyslexic: require("@/assets/fonts/OpenDyslexic-Regular.ttf"),
        OpenDyslexicBold: require("@/assets/fonts/OpenDyslexic-Bold.ttf"),
      });

      setFontsLoaded(true);
    };

    loadFonts();
  }, []);
  useEffect(() => {
    Speech.getAvailableVoicesAsync().then((voices) => {
      console.log("Available voices:", voices);
    });
  }, []);
  const baseColors = contrastSets[contrastLevel];
const colors = grayscaleEnabled
  ? mapColorsToGrayscale(baseColors)
  : baseColors;
  const readingLetterSpacing = dyslexiaSpacing
    ? 2 * fontScale
    : readerMode
    ? 0.6 * fontScale
    : 0;

  const readingExtraLineHeight = dyslexiaSpacing
    ? 16 * fontScale
    : readerMode
    ? 6 * fontScale
    : 0;

  const readableTextAlign = dyslexiaMode ? "left" : "center";
  const chatAreaBg = grayscaleEnabled
  ? colors.background
  : dyslexiaFont
  ? "#FDF6E3"
  : colors.background;

const assistantBubbleBg = grayscaleEnabled
  ? colors.card
  : dyslexiaMode
  ? "#F4EED6"
  : "#EDEDED";

  const tutorialSteps = isArabic
    ? [
        {
          title: "المساعدة",
          description: "ابدأ هذا الدليل السريع في أي وقت للتعرف على الواجهة خطوة بخطوة.",
          placement: "topLeft" as const,
        },
        {
          title: "تحديث",
          description: "يُعيد تهيئة شاشة المحادثة بشكل آمن إذا أردت بدء الشاشة من جديد.",
          placement: "topLeft" as const,
        },
        {
          title: "الرئيسية",
          description: "يعيدك إلى الشاشة الرئيسية للتطبيق.",
          placement: "topLeft" as const,
        },
        {
          title: "رسالة جديدة",
          description: "يمسح المحادثة الحالية ويبدأ محادثة جديدة بسرعة.",
          placement: "topLeft" as const,
        },
        {
          title: "اللغة",
          description: "بدّل بين العربية والإنجليزية من هنا.",
          placement: "topRight" as const,
        },
        {
          title: "إمكانية الوصول",
          description: "افتح أدوات الوصول مثل التباين والتكبير ووضع التركيز.",
          placement: "topRight" as const,
        },
        {
          title: "الميكروفون",
          description: "استخدمه لإدخال سؤالك بالصوت بدل الكتابة.",
          placement: "bottomLeft" as const,
        },
        {
          title: "إرسال",
          description: "اضغط هنا لإرسال رسالتك إلى المساعد بعد كتابتها.",
          placement: "bottomRight" as const,
        },
      ]
    : [
        {
          title: "Help",
          description: "Start this quick walkthrough any time to learn the main controls.",
          placement: "topLeft" as const,
        },
        {
          title: "Refresh",
          description: "Safely refresh the chat screen if you want to reset its current state.",
          placement: "topLeft" as const,
        },
        {
          title: "Home",
          description: "Go back to the app home screen from here.",
          placement: "topLeft" as const,
        },
        {
          title: "New Message",
          description: "Clear the current conversation and start a fresh one quickly.",
          placement: "topLeft" as const,
        },
        {
          title: "Language",
          description: "Switch between Arabic and English here.",
          placement: "topRight" as const,
        },
        {
          title: "Accessibility",
          description: "Open accessibility tools like contrast, text size, and focus mode.",
          placement: "topRight" as const,
        },
        {
          title: "Mic",
          description: "Use the microphone to speak your request instead of typing.",
          placement: "bottomLeft" as const,
        },
        {
          title: "Send",
          description: "Tap here to send your message to the assistant.",
          placement: "bottomRight" as const,
        },
      ];

  const announce = (text: string) => {
    AccessibilityInfo.announceForAccessibility(text);
  };
  const statusText = isListening
    ? isArabic
      ? "يستمع الآن..."
      : "Listening..."
    : "";
  const hasActiveConversation =
    !!message.trim() || messages.length > 0 || isLoading;
  const confirmAction = ({
    title,
    message: alertMessage,
    confirmLabel,
    onConfirm,
  }: {
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void | Promise<void>;
  }) => {
    Alert.alert(title, alertMessage, [
      {
        text: isArabic ? "إلغاء" : "Cancel",
        style: "cancel",
      },
      {
        text: confirmLabel,
        style: "destructive",
        onPress: () => {
          void onConfirm();
        },
      },
    ]);
  };

  useEffect(() => {
    speechEnabledRef.current = speechEnabled;

    if (!speechEnabled) {
      Speech.stop().catch(() => {});
    }
  }, [speechEnabled]);
  useEffect(() => {
    if (!isLoading && previousLoadingRef.current) {
      announce(isArabic ? "أصبح الرد جاهزًا" : "Response ready");
    }

    previousLoadingRef.current = isLoading;
  }, [isLoading, isArabic]);

  const focusNode = (ref: React.RefObject<any>) => {
    if (!ref?.current) return;

    if (Platform.OS === "web") {
      ref.current?.focus?.();
      return;
    }

    const node = findNodeHandle(ref.current);
    if (node) {
      AccessibilityInfo.setAccessibilityFocus(node);
    }
  };
  const speakText = async (text: string) => {
    if (!speechEnabledRef.current) return;

    if (isListening) {
      await ExpoSpeechRecognitionModule.stop();
    }
    try {
      await Speech.stop();

      if (!speechEnabledRef.current) return;

      const voices = await Speech.getAvailableVoicesAsync();

      if (!speechEnabledRef.current) return;

      // find Arabic voice installed on device
      const arabicVoice = voices.find((v) =>
        v.language?.toLowerCase().startsWith("ar"),
      );

      if (!speechEnabledRef.current) return;

      Speech.speak(text, {
        language: arabicVoice ? arabicVoice.language : "ar-SA",
        voice: arabicVoice?.identifier,
        rate: 0.9,
        pitch: 1,
      });
    } catch (e) {
      console.log("Speech error:", e);
    }
  };

  const stopSpeech = async () => {
    try {
      await Speech.stop();
    } catch {}
  };

  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
    announce(isArabic ? "بدأ الاستماع" : "Listening started");
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
    announce(isArabic ? "تم إيقاف الاستماع" : "Listening stopped");
  });

  useSpeechRecognitionEvent("result", (event: any) => {
    const first = event?.results?.[0];

    const transcript =
      first?.transcript ?? first?.value ?? event?.transcript ?? "";

    if (!transcript || typeof transcript !== "string") return;

    const text = transcript.trim().toLowerCase();

    // ACCESSIBILITY PANEL
    if (
      text.includes("open access") ||
      text.includes("open accessibility") ||
      text.includes("افتح الوصول")
    ) {
      setDrawerOpen(true);
      announce(isArabic ? "تم فتح لوحة الوصول" : "Accessibility panel opened");
      return;
    }

    if (
      text.includes("close access") ||
      text.includes("close accessibility") ||
      text.includes("اغلق الوصول")
    ) {
      setDrawerOpen(false);
      announce(
        isArabic ? "تم إغلاق لوحة الوصول" : "Accessibility panel closed",
      );
      return;
    }

    // SEND MESSAGE
    if (
      text.includes("send message") ||
      text.includes("send msg") ||
      text.includes("ارسل الرسالة")
    ) {
      handleSend();
      return;
    }

    // FONT SIZE
    if (
      text.includes("increase font") ||
      text.includes("bigger text") ||
      text.includes("تكبير الخط")
    ) {
      increaseFont();
      return;
    }

    if (
      text.includes("decrease font") ||
      text.includes("smaller text") ||
      text.includes("تصغير الخط")
    ) {
      decreaseFont();
      return;
    }

    // SCREEN READER
    if (
      text.includes("screen reader") ||
      text.includes("read text") ||
      text.includes("قارئ الشاشة")
    ) {
      setSpeechEnabled(true);
      announce(isArabic ? "تم تشغيل قارئ الشاشة" : "Screen reader enabled");
      return;
    }

    if (
      text.includes("disable screen reader") ||
      text.includes("ايقاف قارئ الشاشة")
    ) {
      setSpeechEnabled(false);
      announce(isArabic ? "تم إيقاف قارئ الشاشة" : "Screen reader disabled");
      return;
    }

    // DYSLEXIA FONT
    if (text.includes("dyslexia font") || text.includes("خط عسر القراءة")) {
      setDyslexiaFont(true);
      return;
    }

    if (
      text.includes("disable dyslexia font") ||
      text.includes("ايقاف خط عسر القراءة")
    ) {
      setDyslexiaFont(false);
      return;
    }

    // LINE SPACING
    if (
      text.includes("line spacing") ||
      text.includes("dyslexia spacing") ||
      text.includes("تباعد السطور")
    ) {
      setDyslexiaSpacing(true);
      return;
    }

    if (
      text.includes("disable line spacing") ||
      text.includes("ايقاف تباعد السطور")
    ) {
      setDyslexiaSpacing(false);
      return;
    }

    // SIMPLE MODE
    if (text.includes("simple mode") || text.includes("الوضع المبسط")) {
      setSimpleMode(true);
      return;
    }

    if (
      text.includes("disable simple mode") ||
      text.includes("ايقاف الوضع المبسط")
    ) {
      setSimpleMode(false);
      return;
    }

    // CONTRAST
    if (text.includes("high contrast") || text.includes("تباين عالي")) {
      setContrastLevel(2);
      return;
    }

    if (text.includes("medium contrast") || text.includes("تباين متوسط")) {
      setContrastLevel(1);
      return;
    }

    if (text.includes("low contrast") || text.includes("تباين منخفض")) {
      setContrastLevel(0);
      return;
    }

    // RESET ACCESSIBILITY
    if (
      text.includes("reset") ||
      text.includes("reset accessibility") ||
      text.includes("اعادة الضبط") ||
      text.includes("إعادة الضبط")
    ) {
      resetAccessibility();
      return;
    }
    setMessage(transcript);
  });
  const createThread = async () => {
    const threadData = await fetchOpenAIJson("createThread", `${OPENAI_BASE_URL}/threads`, {
      method: "POST",
      headers: buildOpenAIHeaders(true),
    });
    setThread(threadData);
    return threadData;
  };

  const initChatBot = async () => {
    try {
      const assistantData = await fetchOpenAIJson(
        "initAssistant",
        `${OPENAI_BASE_URL}/assistants`,
        {
          method: "POST",
          headers: buildOpenAIHeaders(true),
          body: JSON.stringify({
        name: "Jordan Government Assistant",
        instructions: `
AI Assistant Configuration for Government Transactions in Jordan

You are an AI system designed to assist Jordanian citizens with inquiries about government transactions. Your role is to guide citizens on where to go, what steps to follow, and how to complete government procedures.

Response Guidelines

1. Plain Text  
All responses must be in plain text without using any special formatting characters such as bold, italics, asterisks, or underscores.

2. Greeting  
Begin each response with a standard greeting.

For English queries:
Dear citizen,

For Arabic queries:
عزيزي المواطن،

3. Structured Process Steps  
When explaining procedures, use a numbered step-by-step format. Each step should include a short description of the action followed by details in plain text.

Example in English

How to Renew Your Jordanian ID (National ID)

Dear citizen, to renew your Jordanian ID, please follow these steps:

1. Visit the Civil Status and Passport Department  
Locate the nearest Civil Status and Passport Department office.

2. Prepare Required Documents  
Bring your current national ID card and any other necessary documents.

3. Complete the Renewal Form  
Fill out the ID renewal application form provided at the office or online.

4. Pay the Renewal Fees  
Be prepared to pay the renewal fees as required for the ID renewal process.

5. Submit Your Application  
Submit the completed application form along with the necessary documents and fees at the Civil Status and Passport Department.

6. Verification and Processing  
Your application will be verified and the processing of your renewed national ID will begin.

7. Collect Your Renewed National ID  
Once the renewal process is complete, you can collect your renewed Jordanian ID from the same office where you submitted your application.

For more details, visit the official Civil Status and Passport Department website:
https://www.cspd.gov.jo

Example in Arabic

كيفية تجديد البطاقة الشخصية الأردنية (الهوية الوطنية)

عزيزي المواطن، لتجديد بطاقتك الشخصية الأردنية، يرجى اتباع الخطوات التالية:

1. زيارة دائرة الأحوال المدنية والجوازات  
ابحث عن أقرب مكتب لدائرة الأحوال المدنية والجوازات.

2. تحضير الوثائق المطلوبة  
أحضر بطاقتك الشخصية الحالية وأي وثائق أخرى ضرورية.

3. إكمال نموذج التجديد  
قم بملء نموذج طلب التجديد المتوفر في المكتب أو عبر الإنترنت.

4. دفع رسوم التجديد  
استعد لدفع رسوم التجديد كما هو مطلوب في عملية تجديد الهوية.

5. تقديم الطلب  
قدم نموذج الطلب المكتمل مع الوثائق المطلوبة والرسوم في دائرة الأحوال المدنية والجوازات.

6. التحقق والمعالجة  
سيتم التحقق من طلبك والبدء في معالجة بطاقتك الشخصية المجددة.

7. استلام بطاقتك الشخصية المجددة  
بمجرد اكتمال عملية التجديد، يمكنك استلام بطاقتك الشخصية المجددة من نفس المكتب الذي قدمت فيه الطلب.

لمزيد من التفاصيل قم بزيارة الموقع الرسمي لدائرة الأحوال المدنية والجوازات:
https://www.cspd.gov.jo

4. Language Sensitive Responses  
Respond in the same language as the user's query, either Arabic or English. Ensure the steps and punctuation are aligned with the language used.

5. Contact Information  
If necessary, provide official contact information such as phone numbers or URLs for government websites.

Example:
For more information visit https://www.jordan.gov.jo

6. Refusal for Illegal Queries  
If a query involves illegal activities, refuse the request politely.

English:
Dear citizen, I am unable to assist with inquiries related to illegal activities.

Arabic:
عزيزي المواطن، لا أستطيع مساعدتك في الاستفسارات المتعلقة بالأنشطة غير القانونية.

7. Non Government Queries  
If the query does not relate to a government transaction respond with:

English:
Dear citizen, I am here to help you with governmental procedures only.

Arabic:
عزيزي المواطن، أنا هنا لمساعدتك في الإجراءات الحكومية فقط.

8. Common Government Transactions  
Be familiar with common government transactions in Jordan including:

ID card renewals  
Driver’s license renewals  
Business registrations  
Tax payments

9. Important Websites for Government Transactions

Driver’s License and Vehicle Services  
https://www.dvld.gov.jo

Property Tax Payments  
https://www.moin.gov.jo

National ID and Passport Services  
https://www.cspd.gov.jo

E Government Services Portal  
https://www.jordan.gov.jo

10. Verify Accuracy  
Ensure all details, processes, and guidance provided are accurate and up to date.
`,
            model: "gpt-4o",
          }),
        },
      );
      const threadData = await createThread();

      setAssistant(assistantData);
      setThread(threadData);
      setIsAppLoading(false);
    } catch (err) {
      console.error("Assistant init error:", err);
      setIsAppLoading(false);
      setMessages((prev) =>
        prev.length > 0
          ? prev
          : [
              {
                isCurrentUser: false,
                message: isArabic
                  ? "تعذر تهيئة الاتصال بالخدمة. تحقق من مفتاح API ثم أعد المحاولة."
                  : "Unable to initialize the service. Check the API key and try again.",
              },
            ],
      );
    }
  };
  useEffect(() => {
    initChatBot();
  }, []);
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        focusNode(chatScrollRef);
      }, 200);
    }
  }, [messages]);
  useSpeechRecognitionEvent("error", () => {
    setIsListening(false);
    announce(
      isArabic ? "حدث خطأ في التعرف على الصوت" : "Speech recognition error",
    );
  });

  const toggleLanguage = async () => {
    const next = isArabic ? "en" : "ar";
    await i18n.changeLanguage(next);

    announce(
      next === "ar"
        ? "تم تغيير اللغة إلى العربية"
        : "Language changed to English",
    );
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => {
      const next = !prev;
      if (!next) setHelpOpen(false);

      announce(
        isArabic
          ? next
            ? "تم فتح لوحة إمكانية الوصول"
            : "تم إغلاق لوحة إمكانية الوصول"
          : next
          ? "Accessibility panel opened"
          : "Accessibility panel closed",
      );
      return next;
    });
  };

  const toggleHelp = () => {
    setHelpOpen((prev) => {
      const next = !prev;

      announce(
        next
          ? isArabic
            ? "تم فتح المساعدة"
            : "Help opened"
          : isArabic
          ? "تم إغلاق المساعدة"
          : "Help closed",
      );

      return next;
    });
  };

  const startTutorial = () => {
    setDrawerOpen(false);
    setHelpOpen(false);
    setTutorialStep(0);
    setTutorialOpen(true);
    announce(
      isArabic
        ? "تم بدء الدليل التعليمي"
        : "Tutorial started",
    );
  };

  const closeTutorial = () => {
    setTutorialOpen(false);
    setTutorialStep(0);
    announce(
      isArabic
        ? "تم إغلاق الدليل التعليمي"
        : "Tutorial closed",
    );
  };

  const handleTutorialNext = () => {
    setTutorialStep((prev) => Math.min(prev + 1, tutorialSteps.length - 1));
  };

  const handleTutorialBack = () => {
    setTutorialStep((prev) => Math.max(prev - 1, 0));
  };

  const resetConversationView = async () => {
    setMessage("");
    setMessages([]);
    setIsLoading(false);
    setDrawerOpen(false);
    setHelpOpen(false);

    await stopSpeech();

    if (isListening) {
      try {
        await ExpoSpeechRecognitionModule.stop();
      } catch {}
    }
  };

  const performStartNewMessage = async () => {
    if (!assistant) return;

    try {
      await resetConversationView();
      await createThread();
      announce(isArabic ? "تم بدء محادثة جديدة" : "Started a new conversation");
    } catch {
      announce(
        isArabic ? "تعذر بدء محادثة جديدة" : "Unable to start a new conversation",
      );
    }
  };

  const handleStartNewMessage = async () => {
    if (!hasActiveConversation) {
      await performStartNewMessage();
      return;
    }

    confirmAction({
      title: isArabic ? "بدء محادثة جديدة؟" : "Start a new conversation?",
      message: isArabic
        ? "سيتم مسح الرسالة الحالية وسجل المحادثة."
        : "This will clear the current draft and conversation history.",
      confirmLabel: isArabic ? "ابدأ جديدًا" : "Start new",
      onConfirm: performStartNewMessage,
    });
  };

  const performRefreshScreen = async () => {
    try {
      await resetConversationView();

      if (assistant) {
        await createThread();
      } else {
        await initChatBot();
      }

      announce(isArabic ? "تم تحديث الشاشة" : "Screen refreshed");
    } catch {
      announce(isArabic ? "تعذر تحديث الشاشة" : "Unable to refresh screen");
    }
  };

  const handleRefreshScreen = async () => {
    if (!hasActiveConversation) {
      await performRefreshScreen();
      return;
    }

    confirmAction({
      title: isArabic ? "تحديث الشاشة؟" : "Refresh the screen?",
      message: isArabic
        ? "سيتم مسح الرسالة الحالية وسجل المحادثة ثم إعادة تحميل الشاشة."
        : "This will clear the current draft and conversation history, then reload the screen.",
      confirmLabel: isArabic ? "تحديث" : "Refresh",
      onConfirm: performRefreshScreen,
    });
  };

  const performGoHome = async () => {
    await stopSpeech();

    if (isListening) {
      try {
        await ExpoSpeechRecognitionModule.stop();
      } catch {}
    }

    router.replace("/");
  };
  const handleGoHome = async () => {
    if (!hasActiveConversation) {
      await performGoHome();
      return;
    }

    confirmAction({
      title: isArabic ? "العودة إلى الرئيسية؟" : "Go back home?",
      message: isArabic
        ? "سيتم ترك المحادثة الحالية والرسالة غير المرسلة."
        : "You will leave the current conversation and any unsent message.",
      confirmLabel: isArabic ? "العودة" : "Go home",
      onConfirm: performGoHome,
    });
  };

  const increaseFont = () => {
    setFontScale((s) => {
      const next = Math.min(1.8, s + 0.1);
      announce(isArabic ? "تم تكبير الخط" : "Font size increased");
      return next;
    });
  };

  const decreaseFont = () => {
    setFontScale((s) => {
      const next = Math.max(0.8, s - 0.1);
      announce(isArabic ? "تم تصغير الخط" : "Font size decreased");
      return next;
    });
  };

  const toggleSpeech = async () => {
    if (speechEnabled) {
      await stopSpeech();
      setSpeechEnabled(false);
      announce(isArabic ? "تم إيقاف القراءة الصوتية" : "Voice reading off");
    } else {
      setSpeechEnabled(true);
      announce(isArabic ? "تم تشغيل القراءة الصوتية" : "Voice reading on");
    }
  };

  const toggleReaderMode = () => {
    if (readerMode) {
      setReaderMode(false);
      announce(isArabic ? "تم إيقاف وضع القراءة" : "Reading mode off");
    } else {
      setReaderMode(true);
      announce(isArabic ? "تم تشغيل وضع القراءة" : "Reading mode on");
    }
  };

  const toggleSimpleMode = () => {
    setSimpleMode((prev) => !prev);
    announce(isArabic ? "تم تبديل الوضع المبسط" : "Simple mode toggled");
  };

  const toggleDyslexiaMode = () => {
    setDyslexiaMode((prev) => {
      const next = !prev;
      announce(
        isArabic
          ? next
            ? "تم تشغيل وضع عسر القراءة لتحسين القراءة"
            : "تم إيقاف وضع عسر القراءة"
          : next
          ? "Dyslexia mode on for easier reading"
          : "Dyslexia mode off",
      );
      return next;
    });
  };

  const toggleFocusMode = () => {
    setFocusMode((prev) => {
      const next = !prev;
      announce(
        isArabic
          ? next
            ? "تم تشغيل وضع التركيز"
            : "تم إيقاف وضع التركيز"
          : next
          ? "Focus mode enabled"
          : "Focus mode disabled",
      );
      return next;
    });
  };
  const toggleEasyTapMode = () => {
    setEasyTapMode((prev) => {
      const next = !prev;
      announce(
        isArabic
          ? next
            ? "تم تشغيل وضع اللمس السهل"
            : "تم إيقاف وضع اللمس السهل"
          : next
          ? "Easy tap mode enabled"
          : "Easy tap mode disabled",
      );
      return next;
    });
  };
  const createAssistantMessage = (content: string) =>
    createNewMessage(content, false);

  const appendAssistantMessage = (content: string) => {
    console.log("[chat] final displayed message:", content);
    setMessages((prev) => [...prev, createAssistantMessage(content)]);
  };

  const getRequestErrorMessage = () =>
    isArabic
      ? "خطأ: تعذر جلب الرد. تحقق من مفتاح API أو الاتصال ثم حاول مرة أخرى."
      : "Error: Unable to fetch response. Check the API key or network connection and try again.";

  const buildOpenAIHeaders = (includeJsonContentType = false) => ({
    Authorization: `Bearer ${apiKey ?? ""}`,
    ...(includeJsonContentType ? { "Content-Type": "application/json" } : {}),
    "OpenAI-Beta": "assistants=v2",
  });

  const fetchOpenAIJson = async (
    stage: string,
    url: string,
    options: RequestInit = {},
  ) => {
    console.log(`[openai:${stage}] request start`);
    console.log(`[openai:${stage}] request URL:`, url);
    console.log(`[openai:${stage}] api key exists:`, Boolean(apiKey));

    const response = await fetch(url, options);
    console.log(`[openai:${stage}] response status:`, response.status);

    const rawBody = await response.text();
    console.log(`[openai:${stage}] raw response body:`, rawBody);

    let parsedResponse: any = null;
    try {
      parsedResponse = rawBody ? JSON.parse(rawBody) : null;
    } catch (error) {
      console.error(`[openai:${stage}] JSON parse error:`, error);
      throw new Error(`Failed to parse ${stage} response JSON.`);
    }

    console.log(`[openai:${stage}] parsed response:`, parsedResponse);

    if (!response.ok) {
      const apiMessage =
        parsedResponse?.error?.message ||
        parsedResponse?.message ||
        `Request failed with status ${response.status}`;
      throw new Error(apiMessage);
    }

    return parsedResponse;
  };

  const performResetAccessibility = async () => {
    if (isListening) {
      try {
        await ExpoSpeechRecognitionModule.stop();
      } catch {}
    }

    await stopSpeech();

    setSpeechEnabled(false);
    setReaderMode(false);
    setSimpleMode(false);
    setDyslexiaMode(false);
    setDyslexiaFont(false);
    setDyslexiaSpacing(false);
    setFocusMode(false);
    setEasyTapMode(false);
    setFontScale(1);
    setContrastLevel(0);
    setGrayscaleEnabled(false);

    announce(isArabic ? "تمت إعادة ضبط الإعدادات" : "Accessibility reset");
  };
  const resetAccessibility = () => {
    confirmAction({
      title: isArabic ? "إعادة ضبط أدوات الوصول؟" : "Reset accessibility tools?",
      message: isArabic
        ? "سيتم إرجاع إعدادات الوصول إلى الوضع الافتراضي."
        : "This will restore the accessibility settings to their default state.",
      confirmLabel: isArabic ? "إعادة الضبط" : "Reset",
      onConfirm: async () => {
        await performResetAccessibility();
      },
    });
  };
  const triggerVoiceInput = async () => {
    try {
      const permissionResponse =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      const granted =
        permissionResponse?.granted ?? permissionResponse?.status === "granted";

      if (!granted) {
        announce(
          isArabic
            ? "تم رفض إذن الميكروفون أو التعرف على الكلام"
            : "Microphone or speech recognition permission was denied",
        );
        return;
      }

      if (isListening) {
        await ExpoSpeechRecognitionModule.stop();
        return;
      }

      await ExpoSpeechRecognitionModule.start({
        lang: isArabic ? "ar-SA" : "en-US",
        interimResults: true,
        continuous: false,
      });
    } catch {
      setIsListening(false);
      announce(
        isArabic ? "تعذر تشغيل الإدخال الصوتي" : "Unable to start voice input",
      );
    }
  };

  const onChangeText = (text: string) => setMessage(text);

  const simplifyBotText = (text: string) => {
    if (!simpleMode) return text;

    let simplified = text;

    simplified = simplified.replace(/\r/g, "");
    simplified = simplified.replace(/\n+/g, " ");

    simplified = simplified.replace(/\d+\.\s*/g, "");

    simplified = simplified.replace(/please follow these steps:?/gi, "");

    simplified = simplified.replace(/for more details.*$/gi, "");

    simplified = simplified.replace(/be prepared to/gi, "");

    simplified = simplified.replace(/locate the nearest/gi, "go to");

    simplified = simplified.replace(/visit the nearest/gi, "go to");

    simplified = simplified.replace(
      /submit your application/gi,
      "submit your request",
    );

    simplified = simplified.replace(
      /complete the application form/gi,
      "fill the form",
    );

    simplified = simplified.replace(/\s+/g, " ");

    simplified = simplified
      .split(/[.!؟?]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(". ");

    return simplified;
  };

  const handleSend = async () => {
    if (isLoading || !message.trim()) return;

    const input = message.trim();
    console.log("[chat] send start:", input);
    setMessage("");
    setIsLoading(true);

    announce(isArabic ? `أنت قلت: ${input}` : `You said: ${input}`);

    try {
      await handleSendMessage(input);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewMessage = (content: string, isUser: boolean) => {
    return { isCurrentUser: isUser, message: content };
  };
  const handleSendMessage = async (input: string) => {
    if (!apiKey) {
      const errorText = isArabic
        ? "خطأ: مفتاح API غير موجود. أضف EXPO_PUBLIC_API_KEY في ملف .env."
        : "Error: API key is missing. Add EXPO_PUBLIC_API_KEY to the .env file.";
      appendAssistantMessage(errorText);
      announce(errorText);
      return;
    }

    if (!assistant || !thread) {
      const errorText = isArabic
        ? "خطأ: المساعد غير جاهز بعد. أعد المحاولة بعد لحظة."
        : "Error: The assistant is not ready yet. Please try again in a moment.";
      appendAssistantMessage(errorText);
      announce(errorText);
      return;
    }

    setMessages((prev) => [...prev, createNewMessage(input, true)]);

    try {
      await fetchOpenAIJson(
        "createMessage",
        `${OPENAI_BASE_URL}/threads/${thread.id}/messages`,
        {
          method: "POST",
          headers: buildOpenAIHeaders(true),
        body: JSON.stringify({
          role: "user",
          content: input,
        }),
        },
      );

      const run = await fetchOpenAIJson(
        "createRun",
        `${OPENAI_BASE_URL}/threads/${thread.id}/runs`,
        {
          method: "POST",
          headers: buildOpenAIHeaders(true),
          body: JSON.stringify({
            assistant_id: assistant.id,
          }),
        },
      );

      let status = "queued";

      while (status === "queued" || status === "in_progress") {
        await new Promise((r) => setTimeout(r, 2000));

        const data = await fetchOpenAIJson(
          "checkRun",
          `${OPENAI_BASE_URL}/threads/${thread.id}/runs/${run.id}`,
          {
            headers: buildOpenAIHeaders(),
          },
        );
        status = data.status;
      }

      const messageData = await fetchOpenAIJson(
        "listMessages",
        `${OPENAI_BASE_URL}/threads/${thread.id}/messages`,
        {
          headers: buildOpenAIHeaders(),
        },
      );

      const reply =
        messageData?.data?.find((item: any) => item.role === "assistant")
          ?.content?.find((content: any) => content.type === "text")?.text
          ?.value ?? null;

      if (!reply) {
        throw new Error("Assistant response field was missing.");
      }

      appendAssistantMessage(reply);

      announce(reply);
      speakText(reply);
    } catch (error) {
      console.error("[chat] send failure:", error);
      const errorText = getRequestErrorMessage();

      appendAssistantMessage(errorText);
      announce(errorText);
      speakText(errorText);
    }

    setTimeout(() => {
      chatScrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        setReduceMotionEnabled(!!enabled);
      })
      .catch(() => {
        setReduceMotionEnabled(false);
      });
  }, []);

  useEffect(() => {
    const image1 = require("@/assets/images/logo.png");
    const image2 = require("@/assets/images/daleelak.png");

    if (reduceMotionEnabled) {
      setCurrentImage(image1);
      return;
    }

    let toggle = false;

    const interval = setInterval(() => {
      toggle = !toggle;
      setCurrentImage(toggle ? image1 : image2);
    }, 500);

    return () => clearInterval(interval);
  }, [reduceMotionEnabled]);

  useEffect(() => {
    if (!focusMode) return;

    setTimeout(() => {
      if (messages.length > 0) {
        focusNode(chatScrollRef);
      } else {
        messageInputRef.current?.focus?.();
      }
    }, 200);
  }, [messages, focusMode]);

  if (isAppLoading) {
    return (
      <LoadingSpinner
        label={isArabic ? "جارٍ تحميل التطبيق..." : "Loading app..."}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: chatAreaBg }]}>
  
      {focusMode && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: NEUTRAL.overlayStrong,
            zIndex: 100,
          }}
        />
      )}

      {!focusMode && (
        <TopBar
          isArabic={isArabic}
          colors={colors}
          drawerOpen={drawerOpen}
          tutorialActive={tutorialOpen}
          easyTapMode={easyTapMode}
          toggleDrawer={toggleDrawer}
          toggleLanguage={toggleLanguage}
          onStartTutorial={startTutorial}
          onGoHome={handleGoHome}
          onRefresh={handleRefreshScreen}
          onStartNewMessage={handleStartNewMessage}
        />
      )}


      {drawerOpen && !focusMode && (
        <Drawer
          isArabic={isArabic}
          colors={colors}
          helpOpen={helpOpen}
          toggleHelp={toggleHelp}
          speechEnabled={speechEnabled}
          readerMode={readerMode}
          simpleMode={simpleMode}
          dyslexiaFont={dyslexiaFont}
          dyslexiaSpacing={dyslexiaSpacing}
          easyTapMode={easyTapMode}
          toggleDyslexiaFont={toggleDyslexiaFont}
          toggleDyslexiaSpacing={toggleDyslexiaSpacing}
          focusMode={focusMode}
          toggleSpeech={toggleSpeech}
          toggleReaderMode={toggleReaderMode}
          toggleSimpleMode={toggleSimpleMode}
          toggleFocusMode={toggleFocusMode}
          toggleEasyTapMode={toggleEasyTapMode}
          increaseFont={increaseFont}
          decreaseFont={decreaseFont}
          contrastLevel={contrastLevel}
          setContrastLevel={setContrastLevel}
          contrastSets={contrastSets}
          t={t}
          resetAccessibility={resetAccessibility}
          announce={announce}
          styles={styles}
        />
      )}

      {focusMode && (
        <View style={styles.focusTopBar}>
          <TouchableOpacity
            style={[styles.focusExitButton, { borderColor: colors.line }]}
            onPress={toggleFocusMode}
            accessibilityRole="button"
            accessibilityLabel={
              isArabic ? "إيقاف وضع التركيز" : "Exit focus mode"
            }
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityState={{ selected: focusMode }}
          >
            <Ionicons name="close-outline" size={22} color={colors.accent} />
            <Text style={[styles.focusExitText, { color: colors.accent }]}>
              {isArabic ? "إنهاء التركيز" : "Exit Focus"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              if (drawerOpen) {
                setDrawerOpen(false);
                setHelpOpen(false);
              }
            }}
          >
            <ScrollView
              ref={chatScrollRef}
            contentContainerStyle={[
  styles.heroContainer,
  readerMode && styles.heroContainerReader,
  dyslexiaMode && styles.heroContainerDyslexia,
  focusMode && { opacity: 0.25 },
]}
              keyboardShouldPersistTaps="handled"
            >
              {messages.length === 0 && (
                <View style={styles.heroInner}>
                  <View ref={heroTitleRef}>
                    <ThemedText
                      style={[
                        styles.h1,
                        {
                          fontSize: 28 * fontScale,
                          color: colors.text,
                          fontFamily: dyslexiaFont
                            ? "OpenDyslexicBold"
                            : undefined,
                          letterSpacing: readingLetterSpacing,
                          lineHeight: (36 + readingExtraLineHeight) * fontScale,
                        },
                      ]}
                    >
                      {t("homeScreenTitle")}
                    </ThemedText>
                  </View>

                  <ThemedText
                    style={[
                      styles.h2,
                      {
                        fontSize: 18 * fontScale,
                        color: colors.text,
                        fontFamily: dyslexiaFont ? "OpenDyslexic" : undefined,
                        letterSpacing: readingLetterSpacing,
                        lineHeight: (26 + readingExtraLineHeight) * fontScale,
                      },
                    ]}
                  >
                    {t("homeScreenSubtitle")}
                  </ThemedText>

                  <Image
                    source={currentImage}
                    style={[
                      styles.logo,
                      grayscaleEnabled &&
                        (Platform.OS === "web"
                          ? (styles.logoWebGrayscale as any)
                          : styles.logoNativeFallback),
                    ]}
                  />
                </View>
              )}
         {messages.map((msg, index) => {
  const isFocused = focusMode && index === messages.length - 1;

  return (
    <MessageBubble
      key={index}
      msg={{
        ...msg,
        message: msg.isCurrentUser
          ? msg.message
          : simplifyBotText(msg.message),
      }}
      isFocused={isFocused}
      isArabic={isArabic}
      colors={colors}
      fontScale={fontScale}
      dyslexiaMode={dyslexiaMode}
      dyslexiaFont={dyslexiaFont}
      readingLetterSpacing={readingLetterSpacing}
      readingExtraLineHeight={readingExtraLineHeight}
      assistantBubbleBg={assistantBubbleBg}
    />
  );
})}
              {isLoading && (
                <LoadingSpinner
                  label={isArabic ? "جارٍ تحميل الرد..." : "Loading response..."}
                />
              )}
            </ScrollView>
          </TouchableWithoutFeedback>
        </GestureHandlerRootView>

        {statusText ? (
          <View
            accessibilityLiveRegion="polite"
            style={{
              paddingHorizontal: SCREEN_EDGE.horizontal,
              paddingBottom: SPACING.xs,
            }}
          >
            <Text
              style={{
                color: colors.accent,
                fontSize: FONT_SIZE.sm,
                fontWeight: "600",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {statusText}
            </Text>
          </View>
        ) : null}

        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          triggerVoiceInput={triggerVoiceInput}
          isListening={isListening}
          isLoading={isLoading}
          isArabic={isArabic}
          colors={colors}
          easyTapMode={easyTapMode}
        />
      </KeyboardAvoidingView>

      <GuidedTutorial
        visible={tutorialOpen}
        colors={colors}
        isArabic={isArabic}
        stepIndex={tutorialStep}
        steps={tutorialSteps}
        onBack={handleTutorialBack}
        onNext={handleTutorialNext}
        onSkip={closeTutorial}
        onDone={closeTutorial}
      />

      {readerMode && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(128,128,128,0.35)",
            zIndex: 999,
          }}
        />
      )}
      {focusMode && messages.length > 0 && (
  <View
    style={{
      position: "absolute",
      left: SCREEN_EDGE.horizontal + SPACING.xs,
      right: SCREEN_EDGE.horizontal + SPACING.xs,
      bottom: 120,
      zIndex: 2000,
    }}
  >
    <MessageBubble
      msg={{
        ...messages[messages.length - 1],
        message: simplifyBotText(messages[messages.length - 1].message),
      }}
      isFocused={true}
      isArabic={isArabic}
      colors={colors}
      fontScale={fontScale}
      dyslexiaMode={dyslexiaMode}
      dyslexiaFont={dyslexiaFont}
      readingLetterSpacing={readingLetterSpacing}
      readingExtraLineHeight={readingExtraLineHeight}
      assistantBubbleBg={assistantBubbleBg}
    />
  </View>
)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  focusTopBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: SCREEN_EDGE.horizontal,
    paddingVertical: SPACING.sm,
    alignItems: "center",
  },

  focusExitButton: {
    minHeight: TOUCH_TARGET,
    minWidth: TOUCH_TARGET,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NEUTRAL.white,
    paddingHorizontal: CONTROL_PADDING,
    paddingVertical: CONTROL_SPACING,
    borderRadius: PILL_RADIUS,
    borderWidth: BORDER_WIDTH.thin,
  },

  focusExitText: {
    marginStart: SPACING.xs + 2,
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },

  heroContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 40,
    paddingHorizontal: SCREEN_EDGE.horizontal + SPACING.xs,
    paddingBottom: 40,
  },

  heroContainerReader: {
    paddingTop: 20,
  },

  heroContainerDyslexia: {
    paddingTop: 20,
  },

  focusContainer: {
    paddingTop: 10,
  },

  heroInner: {
    width: "100%",
    alignItems: "center",
  },

  h1: {
    textAlign: "center",
    marginBottom: 10,
    paddingTop: 50,
    flexShrink: 1,
    width: "100%",
  },

  h2: {
    textAlign: "center",
    marginBottom: 10,
    paddingTop: 30,
    flexShrink: 1,
    width: "100%",
  },

  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginTop: 10,
  },
  logoWebGrayscale: {
    filter: "grayscale(100%)",
  },
  logoNativeFallback: {
    opacity: 0.85,
  },
  sliderCard: {
    borderWidth: BORDER_WIDTH.thin,
    borderRadius: RADIUS.md,
    padding: CONTROL_PADDING,
    marginTop: SPACING.sm,
  },

  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  sliderTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  sliderTitle: {
    marginStart: SPACING.xs + 2,
    fontWeight: "600",
    fontSize: FONT_SIZE.base,
  },

  sliderValue: {
    fontWeight: "600",
    fontSize: FONT_SIZE.sm,
  },

  sliderTrackWrap: {
    marginVertical: CONTROL_SPACING,
  },

  sliderTrack: {
    height: 4,
    borderRadius: 4,
  },

  sliderSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -6,
  },

  sliderStepButton: {
    width: TOUCH_TARGET,
    minHeight: COMPACT_TOUCH_TARGET,
    alignItems: "center",
    justifyContent: "center",
  },

  sliderDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },

  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sliderLabel: {
    fontSize: FONT_SIZE.xs,
  },
});
