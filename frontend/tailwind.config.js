/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F4EC",
        paperDark: "#EFEADA",
        ink: "#1B1F3B",
        inkSoft: "#3A3F63",
        ledger: "#D8D2C2",
        credit: "#2F7A5D",
        creditSoft: "#E4F0EA",
        debit: "#9A3B2E",
        debitSoft: "#F5E7E3",
        gold: "#C89B3C",
        goldSoft: "#F6ECD4",
        night: "#0B0E22",
        night2: "#131742",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(27,31,59,0.06), 0 8px 24px rgba(27,31,59,0.06)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glow: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        floatSlow: "float 9s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        glow: "glow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
