import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "../../context/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickAway);
    }
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--panel-border)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--panel-bg)] shadow-sm hover:border-[var(--accent)] transition-base"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Palette size={16} />
        {themes.find((option) => option.id === theme)?.label ?? "Themes"}
      </button>

      {isOpen && (
        <div className="absolute left-0 z-30 mt-3 w-72 sm:w-96">
          <div className="rounded-xl border border-[color:var(--panel-border)] bg-[var(--panel-bg)] shadow-2xl">
            <div className="sticky top-0 px-4 py-3 border-b border-[color:var(--panel-border)] bg-[var(--panel-bg)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Choose Theme
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Palettes update the entire workspace instantly.
              </p>
            </div>
            <div className="max-h-80 overflow-y-auto p-3 grid grid-cols-1 gap-2 themed-scroll">
              {themes.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setTheme(option.id);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "group relative flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
                    theme === option.id
                      ? "border-[var(--accent)] bg-[color-mix(in_lab,var(--accent)_12%,var(--panel-bg))]"
                      : "border-[color:var(--panel-border)] hover:border-[var(--accent)]"
                  )}
                >
                  <div className="flex gap-1">
                    {option.swatch.map((color, idx) => (
                      <span
                        key={`${option.id}-${color}`}
                        className="h-6 w-6 rounded-full border border-white/50"
                        style={{
                          backgroundColor: color,
                          zIndex: option.swatch.length - idx,
                        }}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {option.label}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {option.description}
                    </p>
                  </div>
                  {theme === option.id && (
                    <span className="absolute inset-0 rounded-lg ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--panel-bg)] pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
