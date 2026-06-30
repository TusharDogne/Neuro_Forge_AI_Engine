/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: '1rem',
        },
        extend: {
            colors: {
                background: { DEFAULT: 'var(--background)' },
                foreground: { DEFAULT: 'var(--foreground)' },
                primary: {
                    DEFAULT: 'var(--primary)',
                    foreground: 'var(--primary-foreground)',
                },
                secondary: {
                    DEFAULT: 'var(--secondary)',
                    foreground: 'var(--secondary-foreground)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'var(--accent-foreground)',
                },
                muted: {
                    DEFAULT: 'var(--muted)',
                    foreground: 'var(--muted-foreground)',
                },
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)',
                },
                border: { DEFAULT: 'var(--border)' },
                input: { DEFAULT: 'var(--input)' },
                ring: { DEFAULT: 'var(--ring)' },
                copper: {
                    100: 'var(--copper-100)',
                    300: 'var(--copper-300)',
                    500: 'var(--copper-500)',
                    700: 'var(--copper-700)',
                },
                cyan: {
                    300: 'var(--cyan-300)',
                    500: 'var(--cyan-500)',
                    700: 'var(--cyan-700)',
                },
                surface: {
                    0: 'var(--surface-0)',
                    1: 'var(--surface-1)',
                    2: 'var(--surface-2)',
                    3: 'var(--surface-3)',
                },
                signal: {
                    green: 'var(--green-signal)',
                    red: 'var(--red-signal)',
                    amber: 'var(--amber-signal)',
                    blue: 'var(--blue-signal)',
                },
            },
            borderRadius: {
                sm: 'calc(var(--radius) - 2px)',
                DEFAULT: 'var(--radius)',
                md: 'var(--radius)',
                lg: 'calc(var(--radius) + 2px)',
                xl: 'calc(var(--radius) + 6px)',
                '2xl': 'calc(var(--radius) + 10px)',
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
            },
            fontSize: {
                '2xs': ['0.6875rem', { lineHeight: '1rem' }],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in-up': 'fadeInUp 0.4s ease forwards',
            },
            keyframes: {
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};