/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
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
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--foreground))",
        },
        destructive: {
          DEFAULT: "hsl(0 62.8% 30.6%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Journey-specific colors (PRD v2.0)
        journey: {
          body: "hsl(var(--journey-body))",
          brand: "hsl(var(--journey-brand))",
          reading: "hsl(var(--journey-reading))",
          writing: "hsl(var(--journey-writing))",
          software: "hsl(var(--journey-software))",
        },
        // Semantic colors
        xp: "hsl(var(--xp-gold))",
        streak: "hsl(var(--streak-fire))",
        achievement: "hsl(var(--achievement-purple))",
        levelup: "hsl(var(--level-up-cyan))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",      /* 16px */
        "2xl": "1.5rem", /* 24px */
        full: "9999px",
      },
      fontFamily: {
        display: ['Syne', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['0.64rem', { lineHeight: '1.5' }],    /* 10px */
        sm: ['0.8rem', { lineHeight: '1.5' }],     /* 13px */
        base: ['1rem', { lineHeight: '1.6' }],     /* 16px */
        lg: ['1.25rem', { lineHeight: '1.5' }],    /* 20px */
        xl: ['1.563rem', { lineHeight: '1.4' }],   /* 25px */
        '2xl': ['1.953rem', { lineHeight: '1.3' }], /* 31px */
        '3xl': ['2.441rem', { lineHeight: '1.2' }], /* 39px */
        '4xl': ['3.052rem', { lineHeight: '1.1' }], /* 49px */
        '5xl': ['3.815rem', { lineHeight: '1' }],   /* 61px */
      },
      spacing: {
        '18': '4.5rem',  /* 72px */
        '88': '22rem',   /* 352px */
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(102, 126, 234, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(102, 126, 234, 0.8)" },
        },
        "confetti-burst": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(-100px) rotate(720deg)", opacity: "0" },
        },
        "xp-float": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-30px) scale(1.2)", opacity: "0" },
        },
        "checkmark-draw": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "confetti-burst": "confetti-burst 0.6s ease-out forwards",
        "xp-float": "xp-float 1s ease-out forwards",
        "checkmark-draw": "checkmark-draw 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

