import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        brand: {
          navy: "var(--primarycolor-darkblue)",
          "dark-navy": "var(--primarycolor-darkblue80)",
          "navy-60": "var(--primarycolor-darkblue60)",
          "navy-40": "var(--primarycolor-darkblue40)",
          yellow: "var(--secondarycolor-monyellow)",
          "yellow-80": "var(--secondarycolor-monyellow80)",
          "yellow-60": "var(--secondarycolor-monyellow60)",
          "yellow-40": "var(--secondarycolor-monyellow40)",
          red: "var(--statecolor-pinkred)",
          green: "var(--statecolor-greenlight)",
          orange: "var(--statecolor-orangeshine)",
          blue: "var(--statecolor-bluesea)",
          "neutral-100": "var(--neutralcolor-100)",
          "neutral-80": "var(--neutralcolor-80)",
          "neutral-60": "var(--neutralcolor-60)",
          "neutral-40": "var(--neutralcolor-40)",
          "neutral-20": "var(--neutralcolor-20)",
          "neutral-10": "var(--neutralcolor-10)",
          "neutral-00": "var(--neutralcolor-00)",
        },
      },
      fontFamily: {
        gilroy: ["Inter", "system-ui", "sans-serif"],
        gabarito: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(13deg, #fceed5 6.17%, #fceed5 75.14%, #ffe7ba 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
