// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary": '#dc2626',
        "secondary": '#b91c1c',
        "teal": '#26dcdc',
        "accent": '#f59e0b',
        "surface": '#f8fafc',
        "text": '#0f1724',
      },
    },
  },
};