import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.2)"
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.25), transparent 50%), radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.2), transparent 40%), radial-gradient(circle at 20% 90%, rgba(74, 222, 128, 0.15), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;
