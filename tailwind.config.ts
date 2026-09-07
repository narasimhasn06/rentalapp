import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14202B",
        body: "#3C4A57",
        muted: "#7C8B99",
        line: "#E2E8ED",
        canvas: "#F6F8FA",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#1B3A5C",
          soft: "#DCE7F0",
        },
        success: "#1E7A4D",
        warning: "#B4761A",
        danger: "#B3352C",
        neutral: "#8A9BA5",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "24px",
        6: "32px",
      },
    },
  },
  plugins: [],
};

export default config;
