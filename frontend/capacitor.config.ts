import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.hisabai.app",
  appName: "HisabAI",
  webDir: "dist",
  backgroundColor: "#0B0E22",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0B0E22",
      showSpinner: false,
    },
  },
};

export default config;
