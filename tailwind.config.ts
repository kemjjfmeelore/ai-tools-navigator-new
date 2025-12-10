import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DaisyUI 提供了主题色，这里我们只保留背景和边框
        background: '#0d1117', // Dark blue-gray background
        card: '#161b22', // Slightly lighter card background
        border: '#30363d', // 边框色
        textlight: '#e6edf3', // Light text
        textdark: '#c9d1d9', // Darker text
      },
      fontFamily: {
        sans: ['"Inter var"', 'sans-serif'], // Modern font
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  // DaisyUI config
  daisyui: {
    themes: ["dark"], // 默认使用 DaisyUI 的 "dark" 主题
    darkTheme: "dark", // 强制深色模式
  },
};
export default config;
