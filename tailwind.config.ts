import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: '#0E1116',
        'ground-deep': '#090B0F',
        surface: '#161B23',
        'surface-2': '#1D242E',
        line: '#28313D',
        ink: '#E8EDF4',
        'ink-mute': '#8D99AB',
        'ink-faint': '#5C6675',
        // Semantic accents: amber = vision/detection layer, cyan = LLM/inference layer.
        vision: '#FFB020',
        'vision-dim': '#7A5510',
        infer: '#3FD8C8',
        'infer-dim': '#1C5F59',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Archivo', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Public Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 8vw, 6.5rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 5vw, 3.75rem)', { lineHeight: '0.98', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        shell: '78rem',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'sweep-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'sweep-in': 'sweep-in .5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
