/** @type {import('tailwindcss').Config} */

import colors from "./theme/colors.js";

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        /*
         * =================================
         * RAW LIGHT / DARK COLORS
         * =================================
         */

        light: colors.light,
        dark: colors.dark,

        /*
         * =================================
         * APP
         * =================================
         */

        app: {
          light: colors.light.background,
          dark: colors.dark.background,
        },

        /*
         * =================================
         * SURFACE
         * =================================
         */

        surface: {
          light: colors.light.surface,
          dark: colors.dark.surface,
        },

        /*
         * =================================
         * ELEVATED
         * =================================
         */

        elevated: {
          light: colors.light.surfaceElevated,
          dark: colors.dark.surfaceElevated,
        },

        /*
         * =================================
         * BORDER
         * =================================
         */

        border: {
          light: colors.light.border,
          dark: colors.dark.border,
        },

        /*
         * =================================
         * PRIMARY
         * =================================
         */

        primary: {
          light: colors.light.blue,
          dark: colors.dark.blue,
        },

        /*
         * =================================
         * SECONDARY
         * =================================
         */

        secondary: {
          light: colors.light.red,
          dark: colors.dark.red,
        },

        /*
         * =================================
         * SUCCESS
         * =================================
         */

        success: {
          light: colors.light.success,
          dark: colors.dark.success,

          backgroundLight: colors.light.successBackground,
          backgroundDark: colors.dark.successBackground,
        },

        /*
         * =================================
         * WARNING
         * =================================
         */

        warning: {
          light: colors.light.warning,
          dark: colors.dark.warning,
        },

        /*
         * =================================
         * ERROR
         * =================================
         */

        error: {
          light: colors.light.error,
          dark: colors.dark.error,

          backgroundLight: colors.light.errorBackground,
          backgroundDark: colors.dark.errorBackground,
        },

        /*
         * =================================
         * TEXT
         * =================================
         */

        text: {
          light: colors.light.text,
          dark: colors.dark.text,

          secondaryLight: colors.light.textSecondary,
          secondaryDark: colors.dark.textSecondary,

          mutedLight: colors.light.textMuted,
          mutedDark: colors.dark.textMuted,
        },

        /*
         * =================================
         * DISABLED
         * =================================
         */

        disabled: {
          light: colors.light.disabled,
          dark: colors.dark.disabled,

          textLight: colors.light.disabledText,
          textDark: colors.dark.disabledText,
        },
      },
    },
  },

  plugins: [],
};
