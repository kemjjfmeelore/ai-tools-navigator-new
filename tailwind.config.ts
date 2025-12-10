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
        primary: '#00ffff', // Tech-inspired cyan
        secondary: '#ff00ff', // Tech-inspired magenta
        background: '#0d1117', // Dark blue-gray background
        card: '#161b22', // Slightly lighter card background
        border: '#30363d', // Border color
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
  plugins: [require('@tailwindcss/typography')],
};
export default config;
