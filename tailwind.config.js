// tailwind.config.js
import { Colors } from './constants/Colors';
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary": Colors.primary,
        "secondary": Colors.secondary,
        "card-neutral": Colors.card.neutral,
        "card-info": Colors.card.info,
        "card-warning": Colors.card.warning,
        "card-success": Colors.card.success,
        "card-error": Colors.card.error,
        "text-dark": Colors.text.dark,
        "text-light": Colors.text.light,
        "background-light": Colors.background.light,
        "background-dark": Colors.background.dark,
      },
    },
  },
};