import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00ffff",
          pink: "#ff00ff",
          purple: "#a020f0",
        },
      },
      boxShadow: {
        neon: "0 0 15px rgba(0, 255, 255, 0.5)",
      },
    },
  },
  plugins: [],
} satisfies Config;
