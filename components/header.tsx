import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface HeaderProps {
  onRefresh?: () => void;
  onToggleLanguage: () => void;
  currentLanguage: string;
}

export default function Header({
  onRefresh,
  onToggleLanguage,
  currentLanguage,
}: HeaderProps) {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerBar}>
        {/* Left side: Logo + Refresh + Speaker */}
        <View style={styles.leftGroup}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />

          {onRefresh && (
            <TouchableOpacity style={styles.iconButton} onPress={onRefresh}>
              <Ionicons name="refresh-outline" size={22} color="#004030" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.speakerButton}>
            <Ionicons name="volume-high-outline" size={18} color="#004030" />
          </TouchableOpacity>
        </View>

        {/* Right side: Language toggle + Profile */}
        <View style={styles.rightGroup}>
          <TouchableOpacity
            style={styles.languageSwitcher}
            onPress={onToggleLanguage}
          >
            <Ionicons name="globe-outline" size={20} color="#004030" />
            <Text style={styles.languageText}>
              {currentLanguage === "ar" ? "English" : "العربية"}
            </Text>
          </TouchableOpacity>

     
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Green background strip
  headerWrapper: {
    backgroundColor: "#004030",
    paddingBottom: 6, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius:10,
    elevation: 4,
  },
  speakerButton: {
    backgroundColor: "",
    borderColor:"#004030",
    borderWidth:3,
    height:40,
    width:40,
    padding: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  // White rounded floating bar
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    height:68,
    borderRadius: 15,
    marginHorizontal: 10,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
   borderTopLeftRadius:20,
   borderTopRightRadius:20,

  },

  leftGroup: { flexDirection: "row", alignItems: "center" },
  rightGroup: { flexDirection: "row", alignItems: "center" },

  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 8,
  },
  iconButton: { marginHorizontal: 6 },

  languageSwitcher: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  languageText: {
    color: "#004030",
    fontWeight: "600",
    marginLeft: 5,
    fontSize: 14,
  },

});
