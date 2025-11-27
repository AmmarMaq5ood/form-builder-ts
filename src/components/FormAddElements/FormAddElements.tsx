import clsx from "clsx";
import React, { useState, useMemo, useEffect } from "react";
import {
  Type,
  AlignLeft,
  ListChecks,
  RadioTower,
  CheckSquare,
  CalendarClock,
  Droplets,
  SlidersHorizontal,
  UploadCloud,
  Heading as HeadingIcon,
  TextQuote,
  Search,
  X,
  GripVertical,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const ELEMENT_DRAG_TYPE = "application/x-form-element";

type PaletteItem = {
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  category: "inputs" | "choices" | "media" | "layout";
};

const ELEMENT_LIBRARY: PaletteItem[] = [
  {
    type: "input",
    label: "Text Input",
    description: "Single-line text",
    icon: Type,
    category: "inputs",
  },
  {
    type: "textarea",
    label: "Paragraph",
    description: "Multi-line text",
    icon: AlignLeft,
    category: "inputs",
  },
  {
    type: "datetime-local",
    label: "Date & Time",
    description: "Schedule input",
    icon: CalendarClock,
    category: "inputs",
  },
  {
    type: "select",
    label: "Dropdown",
    description: "Pick one option",
    icon: ListChecks,
    category: "choices",
  },
  {
    type: "radio",
    label: "Radio Group",
    description: "Single choice",
    icon: RadioTower,
    category: "choices",
  },
  {
    type: "checkbox",
    label: "Checkboxes",
    description: "Multiple choices",
    icon: CheckSquare,
    category: "choices",
  },
  {
    type: "color",
    label: "Color Picker",
    description: "Color selection",
    icon: Droplets,
    category: "media",
  },
  {
    type: "range",
    label: "Slider",
    description: "Value range",
    icon: SlidersHorizontal,
    category: "media",
  },
  {
    type: "file",
    label: "File Upload",
    description: "Attach files",
    icon: UploadCloud,
    category: "media",
  },
  {
    type: "heading",
    label: "Section Heading",
    description: "Organize sections",
    icon: HeadingIcon,
    category: "layout",
  },
  {
    type: "paragraph",
    label: "Paragraph Info",
    description: "Helper text",
    icon: TextQuote,
    category: "layout",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Elements", icon: Layers },
  { id: "inputs", label: "Form Inputs", icon: Type },
  { id: "choices", label: "Choices", icon: CheckSquare },
  { id: "media", label: "Media & Files", icon: UploadCloud },
  { id: "layout", label: "Layout", icon: HeadingIcon },
] as const;

type FormAddElementsProps = {
  handleAddElement: (type: string) => void;
  onDragStateChange?: (active: boolean) => void;
};

const FormAddElements: React.FC<FormAddElementsProps> = ({
  handleAddElement,
  onDragStateChange,
}) => {
  const [userWantsOpen, setUserWantsOpen] = useState(true); // User's preference
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Actual visibility: hide during drag, otherwise follow user preference
  const isVisible = !isDragging && userWantsOpen;

  // Keyboard shortcut to toggle panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setUserWantsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredElements = useMemo(() => {
    let filtered = ELEMENT_LIBRARY;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    type: string
  ) => {
    event.dataTransfer.setData(ELEMENT_DRAG_TYPE, type);
    event.dataTransfer.effectAllowed = "copy";
    setIsDragging(true);
    onDragStateChange?.(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragStateChange?.(false);
  };

  const PANEL_WIDTH = "min(480px, 85vw)";

  return (
    <div className="relative">
      {/* Sidebar Container - moves as one unit */}
      <div
        className="fixed top-44 left-0 z-20 inline-flex items-start transition-transform duration-300 ease-in-out"
        style={{
          transform: isVisible
            ? "translateX(0)"
            : `translateX(calc(-1 * ${PANEL_WIDTH}))`,
        }}
      >
        {/* Element Library Panel */}
        <div
          className="rounded-r-2xl border-r border-t border-b border-[color:var(--panel-border)] bg-[var(--panel-bg)] shadow-2xl p-4"
          style={{ width: PANEL_WIDTH }}
        >
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Layers size={18} className="text-[var(--accent)]" />
                  Element Library
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Drag or click to add • Press ⌘K to toggle
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mt-3">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                placeholder="Search elements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-[color:var(--panel-border)] bg-[color-mix(in_lab,var(--panel-bg)_95%,white)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 themed-scroll">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={clsx(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                      selectedCategory === category.id
                        ? "bg-[var(--accent)] text-white shadow-md"
                        : "bg-[color-mix(in_lab,var(--panel-bg)_90%,white)] text-[var(--text-muted)] border border-[color:var(--panel-border)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <Icon size={12} />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Elements Grid */}
          <div className="max-h-[calc(70vh-180px)] overflow-y-auto themed-scroll pr-1">
            {filteredElements.length > 0 ? (
              <div className="grid gap-2">
                {filteredElements.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.type)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleAddElement(item.type)}
                      className={clsx(
                        "group relative flex items-center gap-3 rounded-xl border border-[color:var(--panel-border)] bg-[color-mix(in_lab,var(--panel-bg)_95%,white)] px-3 py-3 text-left transition-all hover:border-[var(--accent)] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                        isDragging && "cursor-grabbing"
                      )}
                      aria-label={`Add ${item.label}`}
                    >
                      {/* Icon */}
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_lab,var(--accent)_15%,white)] text-[var(--accent)] font-semibold group-hover:bg-[color-mix(in_lab,var(--accent)_25%,white)] transition-colors">
                        <Icon size={20} />
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                          {item.label}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {item.description}
                        </p>
                      </div>

                      {/* Drag Indicator */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical
                          size={16}
                          className="text-[var(--text-muted)]"
                        />
                        <span className="text-[var(--accent)] text-xs font-bold">
                          Drag
                        </span>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/5 to-[var(--accent)]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search
                  size={48}
                  className="mx-auto text-[var(--text-muted)] opacity-30 mb-3"
                />
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                  No elements found
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>

          {/* Footer Hint */}
          {filteredElements.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[color:var(--panel-border)]">
              <p className="text-[10px] text-[var(--text-muted)] text-center">
                💡 Tip: Click to add instantly or drag for precise placement
              </p>
            </div>
          )}
        </div>

        {/* Toggle Button - Attached to panel, moves with it */}
        <button
          type="button"
          onClick={() => setUserWantsOpen((prev) => !prev)}
          className={clsx(
            "h-16 w-8 rounded-r-lg bg-[var(--panel-bg)] border-r border-t border-b border-[color:var(--panel-border)] shadow-lg hover:shadow-xl hover:w-10 transition-all flex items-center justify-center group",
            "hover:bg-[color-mix(in_lab,var(--accent)_10%,var(--panel-bg))]"
          )}
          aria-label={userWantsOpen ? "Hide element library" : "Show element library"}
          aria-expanded={userWantsOpen}
          title={userWantsOpen ? "Hide (⌘K)" : "Show (⌘K)"}
        >
          {userWantsOpen ? (
            <ChevronLeft
              size={18}
              className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors"
            />
          ) : (
            <ChevronRight
              size={18}
              className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors"
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default FormAddElements;

