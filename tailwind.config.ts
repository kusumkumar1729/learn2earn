
import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--color-background)",
                foreground: "var(--color-foreground)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--color-primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--color-secondary-foreground)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--color-accent-foreground)",
                },
                card: {
                    DEFAULT: "var(--color-card)",
                    foreground: "var(--color-card-foreground)",
                },
                popover: {
                    DEFAULT: "var(--color-popover)",
                    foreground: "var(--color-popover-foreground)",
                },
                muted: {
                    DEFAULT: "var(--color-muted)",
                    foreground: "var(--color-muted-foreground)",
                },
                border: "var(--color-border)",
                input: "var(--color-input)",
                ring: "var(--color-ring)",
                success: {
                    DEFAULT: "var(--color-success)",
                    foreground: "var(--color-success-foreground)",
                },
                warning: {
                    DEFAULT: "var(--color-warning)",
                    foreground: "var(--color-warning-foreground)",
                },
                error: {
                    DEFAULT: "var(--color-error)",
                    foreground: "var(--color-error-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--color-destructive)",
                    foreground: "var(--color-destructive-foreground)",
                }
            },
            fontFamily: {
                heading: ["Crimson Text", "serif"],
                body: ["Source Sans 3", "sans-serif"],
                caption: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(245, 158, 11, 0.05)',
                'glow-md': '0 0 20px rgba(245, 158, 11, 0.1)',
                'glow-lg': '0 0 40px rgba(245, 158, 11, 0.15)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-in': 'slideIn 0.3s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [forms],
};

export default config;
