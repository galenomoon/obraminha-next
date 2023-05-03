
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "320px",
      md: "768px",
    },
    extend: {
      colors: {
        dark: {
          background: {
            base: "#343636",
            neutral: "#2C2E2E",
            primary: "",
            secondary: "",
            light: "#484A4A",
            optional: '#EDEDED'
          },
          typography: {
            base: "#fff",
            primary: "#3CB0A0",
            secondary: "#fff",
            light: "#999E9D",
            danger: "",
          },
        },
        background: {
          base: "#F0F0F0",
          neutral: "#fff",
          primary: "",
          secondary: "#3AAF9F",
          light: "#F4F8F7",
          optional: '#EDEDED'
        },
        typography: {
          base: "#343636",
          primary: "#3CB0A0",
          secondary: "#ffffff",
          light: "#999E9D",
          danger: "#3AAF9F",
        },
      },
      keyframes: {
        "slide-in-r": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-t": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-b": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-l": {
          "0%": { transform: "translateX(200%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "spin": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "rotate-scale-up": {
          "0%": { transform: "scale(1) rotateZ(0)" },
          "50%": { transform: " scale(1.1) rotateZ(180deg)" },
          "100%": { transform: "scale(1) rotateZ(360deg)" }
        },
        "pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 }
        }
      },
      animation: {
        "slide-in-r": "slide-in-r 1.7s cubic-bezier(0.230, 1.000, 0.320, 1.000) both",
        "slide-in-l": "slide-in-l 1.7s cubic-bezier(0.230, 1.000, 0.320, 1.000) both",
        "slide-in-t": "slide-in-t 0.7s cubic-bezier(0.230, 1.000, 0.320, 1.000) both",
        "slide-in-b": "slide-in-b 0.7s cubic-bezier(0.230, 1.000, 0.320, 1.000) both",
        "switch-theme": "rotate-scale-up 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both",
        "fade-in": "fade-in 0.2s cubic-bezier(0.230, 1.000, 0.320, 1.000) both",
        "spin": "spin 1.5s linear infinite",
        "pulse": "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
    backgroundImage: {
      'splash-green': "url('/src/assets/splash-green.svg')",
      'dark-splash-green': "url('/src/assets/dark-splash-green.svg')",
      'light-banner': "url('/src/assets/light-banner.svg')",
      'dark-banner': "url('/src/assets/dark-banner.svg')",
      'base-light': "url('/src/assets/base-light.svg')",
      'base-dark': "url('/src/assets/base-dark.svg')",
    },
    plugins: [],
  }
}