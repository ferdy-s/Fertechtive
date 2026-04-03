import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },

      colors: {
        neon: {
          pink: "#ff28a7",
          cyan: "#00f6ff",
          violet: "#7c4dff",
        },
      },

      backgroundImage: {
        "grid-tech":
          "radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px)",
      },

      backgroundSize: {
        "grid-size": "12px 12px",
      },

      boxShadow: {
        glow: "0 0 20px rgba(124,77,255,0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
