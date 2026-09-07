import type { Config } from "tailwindcss";

/**
 * A1 colour tokens are stored as CSS custom properties (see
 * src/app/globals.css) so every colour has exactly one source of hex
 * values, outside component code. This helper wires each Tailwind colour
 * to its CSS variable in the `r g b` triplet format Tailwind's opacity
 * modifiers (`bg-warning/12`, spec/foundations.md's "12% opacity" status
 * chip background) require.
 */
function withOpacity(variable: string): string {
  // Tailwind's colour values genuinely accept a function at runtime (it's
  // how every opacity-modifier colour, e.g. `bg-warning/12`, is meant to
  // work) but the shipped Config type only declares `string`, so the cast
  // below tells TypeScript what Tailwind itself actually accepts.
  return ((({ opacityValue }: { opacityValue?: string }) =>
    opacityValue === undefined
      ? `rgb(var(${variable}))`
      : `rgb(var(${variable}) / ${opacityValue})`) as unknown) as string;
}

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: withOpacity("--color-ink"),
        body: withOpacity("--color-body"),
        muted: withOpacity("--color-muted"),
        line: withOpacity("--color-line"),
        canvas: withOpacity("--color-canvas"),
        surface: withOpacity("--color-surface"),
        primary: {
          DEFAULT: withOpacity("--color-primary"),
          soft: withOpacity("--color-primary-soft"),
        },
        success: withOpacity("--color-success"),
        warning: withOpacity("--color-warning"),
        danger: withOpacity("--color-danger"),
        neutral: withOpacity("--color-neutral"),
      },
      // A1 type scale (spec/foundations.md). Font weight travels with the
      // size on purpose — every screen asks for "h1", not "20px + 600".
      // "body" (14px/400, the default text size) is deliberately NOT a
      // key here — it's set as the base size on the <body> element in
      // globals.css instead, because `body` is also an A1 colour token
      // and Tailwind's text-color and font-size utilities share the
      // `text-` prefix. Two same-named utilities both targeting `color`
      // vs. `font-size` don't conflict on their own, but `text-body`
      // (size) next to a different `text-{colour}` on the same element
      // would silently race on declaration order — so size and colour
      // never share the "body" name as utilities.
      fontSize: {
        display: ["28px", { lineHeight: "34px", fontWeight: "600" }],
        h1: ["20px", { lineHeight: "26px", fontWeight: "600" }],
        h2: ["16px", { lineHeight: "22px", fontWeight: "600" }],
        small: ["13px", { lineHeight: "18px", fontWeight: "400" }],
        label: [
          "11px",
          { lineHeight: "14px", fontWeight: "600", letterSpacing: "0.6px" },
        ],
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
      boxShadow: {
        1: "0 1px 2px rgb(var(--color-ink) / 0.06)",
        2: "0 8px 24px rgb(var(--color-ink) / 0.12)",
      },
      // Status chips use a 12% opacity background (spec/foundations.md
      // A2 "Status chip") — not in Tailwind's default opacity scale.
      opacity: {
        12: "0.12",
      },
    },
  },
  plugins: [],
};

export default config;
