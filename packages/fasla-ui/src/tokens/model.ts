export type Density = "compact" | "comfortable" | "spacious";

export interface TokenSet {
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  spacing: {
    /** Multipliers for vertical rhythm based on density */
    densityMultiplier: Record<Density, number>;
  };
  typography: {
    fontFamily: string;
    baseFontSizePx: number;
    lineHeight: number;
  };
  motion: {
    durationsMs: {
      fast: number;
      base: number;
      slow: number;
    };
  };
}

export const baseTokens: TokenSet = {
  radius: { sm: "0.5rem", md: "0.75rem", lg: "1rem" },
  spacing: { densityMultiplier: { compact: 0.9, comfortable: 1.0, spacious: 1.1 } },
  // Brand V2.5 §14 — Geist is the LTR face. Arabic is set in Cairo, which the
  // Tailwind preset selects per direction; this scaffold carries only the base.
  // 16/24 is the `Base` rung, identical in both Figma ramps.
  typography: { fontFamily: "Geist", baseFontSizePx: 16, lineHeight: 1.5 },
  motion: { durationsMs: { fast: 120, base: 180, slow: 260 } },
};
