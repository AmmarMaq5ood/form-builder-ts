import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeId =
  | "classic"
  | "midnight"
  | "sunrise"
  | "forest"
  | "oceanic"
  | "desert"
  | "nebula"
  | "slate"
  | "coffee"
  | "bubblegum"
  | "slime"
  | "unicorn"
  | "lego"
  | "watermelon"
  | "banana"
  | "spacecat"
  | "cottoncandy"
  | "aurora"
  | "magma"
  | "cyberpunk"
  | "moonlight"
  | "emerald"
  | "sakura"
  | "noir"
  | "sunsetreef";

type ThemeColors = {
  "--app-bg": string;
  "--panel-bg": string;
  "--card-bg": string;
  "--panel-border": string;
  "--text-primary": string;
  "--text-muted": string;
  "--accent": string;
  "--accent-contrast": string;
  "--tip-bg": string;
  "--tip-border": string;
};

type ThemeMeta = {
  id: ThemeId;
  label: string;
  description: string;
  swatch: [string, string, string];
  colors: ThemeColors;
};

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (next: ThemeId) => void;
  themes: ThemeMeta[];
};

const THEME_STORAGE_KEY = "form-builder-theme";

const THEME_OPTIONS: ThemeMeta[] = [
  {
    id: "classic",
    label: "Classic Light",
    description: "Airy whites with blue accents",
    swatch: ["#eff6ff", "#dbeafe", "#3b82f6"],
    colors: {
      "--app-bg": "#f6f7fb",
      "--panel-bg": "#ffffff",
      "--card-bg": "#ffffff",
      "--panel-border": "#e2e8f0",
      "--text-primary": "#0f172a",
      "--text-muted": "#64748b",
      "--accent": "#2563eb",
      "--accent-contrast": "#ffffff",
      "--tip-bg": "#eff6ff",
      "--tip-border": "#bfdbfe",
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep charcoal with teal glow",
    swatch: ["#0f172a", "#1e293b", "#0ea5e9"],
    colors: {
      "--app-bg": "#050918",
      "--panel-bg": "#0f172a",
      "--card-bg": "#111b2f",
      "--panel-border": "#1e293b",
      "--text-primary": "#f1f5f9",
      "--text-muted": "#94a3b8",
      "--accent": "#0ea5e9",
      "--accent-contrast": "#062233",
      "--tip-bg": "#082f49",
      "--tip-border": "#0ea5e9",
    },
  },
  {
    id: "sunrise",
    label: "Sunrise",
    description: "Warm peaches and corals",
    swatch: ["#fff7ed", "#fed7aa", "#fb7185"],
    colors: {
      "--app-bg": "#fff7ed",
      "--panel-bg": "#fffbf5",
      "--card-bg": "#fff4eb",
      "--panel-border": "#fed7aa",
      "--text-primary": "#78350f",
      "--text-muted": "#a16207",
      "--accent": "#fb7185",
      "--accent-contrast": "#4c0519",
      "--tip-bg": "#fff1e6",
      "--tip-border": "#fdba74",
    },
  },
  {
    id: "forest",
    label: "Forest",
    description: "Earthy greens with bold deep tones",
    swatch: ["#e8f5e9", "#81c784", "#1b5e20"],
    colors: {
      "--app-bg": "#f1f5f2",
      "--panel-bg": "#fefefb",
      "--card-bg": "#f7faf7",
      "--panel-border": "#cddfd1",
      "--text-primary": "#0f2f24",
      "--text-muted": "#4d7c66",
      "--accent": "#15803d",
      "--accent-contrast": "#f0fdf4",
      "--tip-bg": "#ecfdf5",
      "--tip-border": "#86efac",
    },
  },
  {
    id: "oceanic",
    label: "Oceanic",
    description: "Calm blues and refreshing cyan",
    swatch: ["#e0f2ff", "#bae6fd", "#0284c7"],
    colors: {
      "--app-bg": "#e0f2ff",
      "--panel-bg": "#f8fdff",
      "--card-bg": "#e6f6ff",
      "--panel-border": "#bae6fd",
      "--text-primary": "#082f49",
      "--text-muted": "#0f4c81",
      "--accent": "#0284c7",
      "--accent-contrast": "#f0f9ff",
      "--tip-bg": "#dbeafe",
      "--tip-border": "#38bdf8",
    },
  },
  {
    id: "desert",
    label: "Desert Sands",
    description: "Warm beige and golden accents",
    swatch: ["#fdf6e3", "#f4d7a1", "#d97706"],
    colors: {
      "--app-bg": "#fdf6e3",
      "--panel-bg": "#fffaf0",
      "--card-bg": "#fbead1",
      "--panel-border": "#f4d7a1",
      "--text-primary": "#7c4a15",
      "--text-muted": "#b45309",
      "--accent": "#d97706",
      "--accent-contrast": "#fff7e6",
      "--tip-bg": "#fffbeb",
      "--tip-border": "#fcd34d",
    },
  },
  {
    id: "nebula",
    label: "Nebula",
    description: "Cosmic purples with neon pink",
    swatch: ["#ede9fe", "#c084fc", "#db2777"],
    colors: {
      "--app-bg": "#f5e1ff",
      "--panel-bg": "#fbf4ff",
      "--card-bg": "#f3e0ff",
      "--panel-border": "#e0c3fc",
      "--text-primary": "#3b0764",
      "--text-muted": "#7e22ce",
      "--accent": "#db2777",
      "--accent-contrast": "#fdf2f8",
      "--tip-bg": "#fce7f3",
      "--tip-border": "#f472b6",
    },
  },
  {
    id: "slate",
    label: "Slate",
    description: "Professional grays and blues",
    swatch: ["#f3f4f6", "#cbd5e1", "#2563eb"],
    colors: {
      "--app-bg": "#f3f4f6",
      "--panel-bg": "#ffffff",
      "--card-bg": "#f8fafc",
      "--panel-border": "#cbd5e1",
      "--text-primary": "#0f172a",
      "--text-muted": "#475569",
      "--accent": "#2563eb",
      "--accent-contrast": "#f8fafc",
      "--tip-bg": "#e2e8f0",
      "--tip-border": "#94a3b8",
    },
  },
  {
    id: "coffee",
    label: "Coffee House",
    description: "Warm browns and latte tones",
    swatch: ["#f7ede2", "#e4d4c5", "#6b4f4f"],
    colors: {
      "--app-bg": "#f7ede2",
      "--panel-bg": "#fffaf6",
      "--card-bg": "#f4e7dc",
      "--panel-border": "#e4d4c5",
      "--text-primary": "#4a2c2a",
      "--text-muted": "#8c5a54",
      "--accent": "#6b4f4f",
      "--accent-contrast": "#fef6ed",
      "--tip-bg": "#fef3e7",
      "--tip-border": "#f5cbaa",
    },
  },
  {
    id: "bubblegum",
    label: "Bubblegum",
    description: "Playful pinks and sweet vibes",
    swatch: ["#ffe4f3", "#ffc1e3", "#ec4899"],
    colors: {
      "--app-bg": "#ffe4f3",
      "--panel-bg": "#fff7fb",
      "--card-bg": "#ffeef7",
      "--panel-border": "#ffc1e3",
      "--text-primary": "#831843",
      "--text-muted": "#db2777",
      "--accent": "#ec4899",
      "--accent-contrast": "#fff5fb",
      "--tip-bg": "#fdf2f8",
      "--tip-border": "#f9a8d4",
    },
  },
  {
    id: "slime",
    label: "Slime Time",
    description: "Electric greens and dark accents",
    swatch: ["#ecfccb", "#d9f99d", "#4ade80"],
    colors: {
      "--app-bg": "#ecfccb",
      "--panel-bg": "#f7fee7",
      "--card-bg": "#e8f9c2",
      "--panel-border": "#d9f99d",
      "--text-primary": "#134e4a",
      "--text-muted": "#3f6212",
      "--accent": "#4ade80",
      "--accent-contrast": "#052e16",
      "--tip-bg": "#f0fdf4",
      "--tip-border": "#86efac",
    },
  },
  {
    id: "unicorn",
    label: "Unicorn Dream",
    description: "Magical pastels and sparkles",
    swatch: ["#fdf2ff", "#fbcfe8", "#a5b4fc"],
    colors: {
      "--app-bg": "#fdf2ff",
      "--panel-bg": "#fff9ff",
      "--card-bg": "#fce7ff",
      "--panel-border": "#fbcfe8",
      "--text-primary": "#701a75",
      "--text-muted": "#a855f7",
      "--accent": "#a5b4fc",
      "--accent-contrast": "#f8fafc",
      "--tip-bg": "#f5f3ff",
      "--tip-border": "#c084fc",
    },
  },
  {
    id: "lego",
    label: "Lego Land",
    description: "Primary colors with playful contrast",
    swatch: ["#fcd34d", "#ef4444", "#3b82f6"],
    colors: {
      "--app-bg": "#fff7c2",
      "--panel-bg": "#fffdf5",
      "--card-bg": "#fff2c9",
      "--panel-border": "#fde047",
      "--text-primary": "#1d1d1d",
      "--text-muted": "#b91c1c",
      "--accent": "#2563eb",
      "--accent-contrast": "#fffef5",
      "--tip-bg": "#fff8dc",
      "--tip-border": "#facc15",
    },
  },
  {
    id: "watermelon",
    label: "Watermelon",
    description: "Juicy reds and fresh greens",
    swatch: ["#ffe4e6", "#fecdd3", "#16a34a"],
    colors: {
      "--app-bg": "#ffe4e6",
      "--panel-bg": "#fff7f7",
      "--card-bg": "#ffe0e0",
      "--panel-border": "#fecdd3",
      "--text-primary": "#7f1d1d",
      "--text-muted": "#fb7185",
      "--accent": "#16a34a",
      "--accent-contrast": "#ecfccb",
      "--tip-bg": "#fef2f2",
      "--tip-border": "#f87171",
    },
  },
  {
    id: "banana",
    label: "Banana Split",
    description: "Yellows and browns",
    swatch: ["#fef9c3", "#fde68a", "#facc15"],
    colors: {
      "--app-bg": "#fef9c3",
      "--panel-bg": "#fffef0",
      "--card-bg": "#fff5b1",
      "--panel-border": "#fde68a",
      "--text-primary": "#854d0e",
      "--text-muted": "#ca8a04",
      "--accent": "#facc15",
      "--accent-contrast": "#422006",
      "--tip-bg": "#fefce8",
      "--tip-border": "#fde047",
    },
  },
  {
    id: "spacecat",
    label: "Space Cat",
    description: "Galactic purples with neon green",
    swatch: ["#f3e8ff", "#a855f7", "#84cc16"],
    colors: {
      "--app-bg": "#f3e8ff",
      "--panel-bg": "#faf5ff",
      "--card-bg": "#efe0ff",
      "--panel-border": "#d8b4fe",
      "--text-primary": "#312e81",
      "--text-muted": "#6b21a8",
      "--accent": "#84cc16",
      "--accent-contrast": "#052e16",
      "--tip-bg": "#eef2ff",
      "--tip-border": "#a5b4fc",
    },
  },
  {
    id: "cottoncandy",
    label: "Cotton Candy",
    description: "Soft blues and pinks",
    swatch: ["#e0f2fe", "#bfdbfe", "#fb7185"],
    colors: {
      "--app-bg": "#e0f2fe",
      "--panel-bg": "#fdf2ff",
      "--card-bg": "#f0f9ff",
      "--panel-border": "#bfdbfe",
      "--text-primary": "#0f172a",
      "--text-muted": "#ec4899",
      "--accent": "#fb7185",
      "--accent-contrast": "#fff7f9",
      "--tip-bg": "#fce7f3",
      "--tip-border": "#fbb6ce",
    },
  },
  {
    id: "aurora",
    label: "Aurora Glow",
    description: "Mint greens and frosty blues with aurora radiance",
    swatch: ["#ecfdf5", "#6ee7b7", "#2563eb"],
    colors: {
      "--app-bg": "#ecfdf5",
      "--panel-bg": "#f0fdfa",
      "--card-bg": "#f0fdf4",
      "--panel-border": "#99f6e4",
      "--text-primary": "#134e4a",
      "--text-muted": "#2dd4bf",
      "--accent": "#2563eb",
      "--accent-contrast": "#f0f9ff",
      "--tip-bg": "#f0fdfa",
      "--tip-border": "#5eead4",
    },
  },
  {
    id: "magma",
    label: "Magma Core",
    description: "Black volcanic rock with molten lava accents",
    swatch: ["#1c1917", "#dc2626", "#f97316"],
    colors: {
      "--app-bg": "#1c1917",
      "--panel-bg": "#292524",
      "--card-bg": "#44403c",
      "--panel-border": "#78350f",
      "--text-primary": "#fef3c7",
      "--text-muted": "#f97316",
      "--accent": "#dc2626",
      "--accent-contrast": "#fff7ed",
      "--tip-bg": "#451a03",
      "--tip-border": "#ea580c",
    },
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk Neon",
    description: "Electric blues and vaporwave magenta",
    swatch: ["#0f0f1f", "#7c3aed", "#ff0080"],
    colors: {
      "--app-bg": "#0f0f1f",
      "--panel-bg": "#1a1a2e",
      "--card-bg": "#16213e",
      "--panel-border": "#7c3aed",
      "--text-primary": "#e0e7ff",
      "--text-muted": "#a78bfa",
      "--accent": "#ff0080",
      "--accent-contrast": "#ffffff",
      "--tip-bg": "#2e1065",
      "--tip-border": "#d946ef",
    },
  },
  {
    id: "moonlight",
    label: "Moonlight Frost",
    description: "Soft ice blues with deep moon shadows",
    swatch: ["#e0f2fe", "#93c5fd", "#1e3a8a"],
    colors: {
      "--app-bg": "#f0f9ff",
      "--panel-bg": "#e0f2fe",
      "--card-bg": "#bae6fd",
      "--panel-border": "#7dd3fc",
      "--text-primary": "#0c4a6e",
      "--text-muted": "#0284c7",
      "--accent": "#1e3a8a",
      "--accent-contrast": "#f0f9ff",
      "--tip-bg": "#e0f2fe",
      "--tip-border": "#38bdf8",
    },
  },
  {
    id: "emerald",
    label: "Emerald Depths",
    description: "Jade greens with obsidian contrast",
    swatch: ["#ecfdf5", "#34d399", "#065f46"],
    colors: {
      "--app-bg": "#064e3b",
      "--panel-bg": "#065f46",
      "--card-bg": "#047857",
      "--panel-border": "#34d399",
      "--text-primary": "#ecfdf5",
      "--text-muted": "#6ee7b7",
      "--accent": "#10b981",
      "--accent-contrast": "#022c22",
      "--tip-bg": "#064e3b",
      "--tip-border": "#10b981",
    },
  },
  {
    id: "sakura",
    label: "Sakura Bloom",
    description: "Delicate cherry blossoms with soft spring tones",
    swatch: ["#fff1f2", "#f9a8d4", "#ec4899"],
    colors: {
      "--app-bg": "#fff1f2",
      "--panel-bg": "#ffe4e6",
      "--card-bg": "#fecdd3",
      "--panel-border": "#fda4af",
      "--text-primary": "#881337",
      "--text-muted": "#e11d48",
      "--accent": "#ec4899",
      "--accent-contrast": "#fff1f2",
      "--tip-bg": "#fff1f2",
      "--tip-border": "#f43f5e",
    },
  },
  {
    id: "noir",
    label: "Noir Minimal",
    description: "Sleek grayscale with high-contrast blacks",
    swatch: ["#f8fafc", "#64748b", "#1e293b"],
    colors: {
      "--app-bg": "#000000",
      "--panel-bg": "#171717",
      "--card-bg": "#262626",
      "--panel-border": "#404040",
      "--text-primary": "#fafafa",
      "--text-muted": "#a3a3a3",
      "--accent": "#ffffff",
      "--accent-contrast": "#000000",
      "--tip-bg": "#171717",
      "--tip-border": "#525252",
    },
  },
  {
    id: "sunsetreef",
    label: "Sunset Reef",
    description: "Coral reds, sunset orange, deep reef blue",
    swatch: ["#ffedd5", "#fb923c", "#2563eb"],
    colors: {
      "--app-bg": "#ffedd5",
      "--panel-bg": "#fed7aa",
      "--card-bg": "#fdba74",
      "--panel-border": "#fb923c",
      "--text-primary": "#7c2d12",
      "--text-muted": "#ea580c",
      "--accent": "#2563eb",
      "--accent-contrast": "#eff6ff",
      "--tip-bg": "#ffedd5",
      "--tip-border": "#f97316",
    },
  },
];

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    return stored || "classic";
  });

  useEffect(() => {
    const currentTheme = THEME_OPTIONS.find((t) => t.id === theme);
    if (currentTheme) {
      const root = document.documentElement;
      Object.entries(currentTheme.colors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      // Also set the data-theme attribute for any CSS selectors that might still use it
      // although we are moving away from it for colors.
      root.dataset.theme = theme;
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      themes: THEME_OPTIONS,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
