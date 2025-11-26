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
  | "cottoncandy";

type ThemeMeta = {
  id: ThemeId;
  label: string;
  description: string;
  swatch: [string, string, string];
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
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep charcoal with teal glow",
    swatch: ["#0f172a", "#1e1b4b", "#0ea5e9"],
  },
  {
    id: "sunrise",
    label: "Sunrise",
    description: "Warm peaches and corals",
    swatch: ["#fff7ed", "#fed7aa", "#fb7185"],
  },
  {
    id: "forest",
    label: "Forest",
    description: "Earthy greens with sand highlights",
    swatch: ["#f1f5f2", "#cbd5cf", "#15803d"],
  },
  {
    id: "oceanic",
    label: "Oceanic",
    description: "Cool aquatic blues with foamy whites",
    swatch: ["#e0f7ff", "#7dd3fc", "#0369a1"],
  },
  {
    id: "desert",
    label: "Desert Sand",
    description: "Soft tans with burnt amber accents",
    swatch: ["#fdf6e3", "#f4d7a1", "#b45309"],
  },
  {
    id: "nebula",
    label: "Nebula",
    description: "Cosmic purples with neon pink highlights",
    swatch: ["#f5e1ff", "#c084fc", "#db2777"],
  },
  {
    id: "slate",
    label: "Slate Minimal",
    description: "Muted grays with cool indigo hints",
    swatch: ["#f3f4f6", "#cbd5e1", "#475569"],
  },
  {
    id: "coffee",
    label: "Coffee Roast",
    description: "Creamy latte tones with rich espresso browns",
    swatch: ["#f7ede2", "#d6ccc2", "#6b4f4f"],
  },
  {
    id: "bubblegum",
    label: "Bubblegum Pop",
    description: "Candy pinks with fizzy blue accents",
    swatch: ["#ffe4f3", "#ff8fcb", "#3ea8ff"],
  },
  {
    id: "slime",
    label: "Radioactive Slime",
    description: "Toxic greens with gooey chartreuse",
    swatch: ["#ecfccb", "#bef264", "#4ade80"],
  },
  {
    id: "unicorn",
    label: "Unicorn Dreams",
    description: "Pastel rainbow magic",
    swatch: ["#fdf2ff", "#fbcfe8", "#a5b4fc"],
  },
  {
    id: "lego",
    label: "Lego Land",
    description: "Primary colors with playful contrast",
    swatch: ["#fde047", "#ef4444", "#3b82f6"],
  },
  {
    id: "watermelon",
    label: "Watermelon Smash",
    description: "Juicy reds with rind green",
    swatch: ["#ffe4e6", "#fb7185", "#16a34a"],
  },
  {
    id: "banana",
    label: "Banana Peel",
    description: "Yellows everywhere (slip carefully)",
    swatch: ["#fef9c3", "#facc15", "#ca8a04"],
  },
  {
    id: "spacecat",
    label: "Space Cat",
    description: "Galactic purple with laser neon green",
    swatch: ["#f3e8ff", "#a855f7", "#84cc16"],
  },
  {
    id: "cottoncandy",
    label: "Cotton Candy",
    description: "Fluffy blues and pink clouds",
    swatch: ["#e0f2fe", "#fbcfe8", "#fb7185"],
  },
];

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    return stored || "classic";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
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
