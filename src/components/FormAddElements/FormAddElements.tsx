import React, { useState, useMemo, useEffect } from "react";
import {
  Type,
  CheckSquare,
  Circle,
  AlignLeft,
  Image as ImageIcon,
  Calendar,
  Hash,
  Mail,
  Phone,
  Layout,
  Minus,
  Search,
  X,
  GripVertical,
  Layers,
  ChevronLeft,
  ChevronRight,
  List,
  CheckCircle2,
  FileText,
  Clock,
  Upload,
  Video,
  Music,
  Link,
  Box,
  SeparatorHorizontal,
} from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

interface FormAddElementsProps {
  handleAddElement: (type: string) => void;
  onDragStateChange?: (isDragging: boolean) => void;
}

interface PaletteItem {
  type: string;
  label: string;
  description: string;
  icon: React.ElementType;
  category: "inputs" | "choices" | "media" | "layout";
}

export const ELEMENT_DRAG_TYPE = "application/react-dnd";

const ELEMENT_LIBRARY: PaletteItem[] = [
  // Inputs
  {
    type: "input",
    label: "Text Input",
    description: "Single-line text field",
    icon: Type,
    category: "inputs",
  },
  {
    type: "textarea",
    label: "Text Area",
    description: "Multi-line text field",
    icon: AlignLeft,
    category: "inputs",
  },
  {
    type: "number",
    label: "Number",
    description: "Numeric input",
    icon: Hash,
    category: "inputs",
  },
  {
    type: "email",
    label: "Email",
    description: "Email address validation",
    icon: Mail,
    category: "inputs",
  },
  {
    type: "phone",
    label: "Phone",
    description: "Phone number input",
    icon: Phone,
    category: "inputs",
  },
  {
    type: "date",
    label: "Date Picker",
    description: "Select a date",
    icon: Calendar,
    category: "inputs",
  },
  {
    type: "time",
    label: "Time Picker",
    description: "Select a time",
    icon: Clock,
    category: "inputs",
  },
  {
    type: "url",
    label: "Website",
    description: "URL input field",
    icon: Link,
    category: "inputs",
  },

  // Choices
  {
    type: "checkbox",
    label: "Checkbox",
    description: "Multiple selection",
    icon: CheckSquare,
    category: "choices",
  },
  {
    type: "radio",
    label: "Radio Group",
    description: "Single selection",
    icon: Circle,
    category: "choices",
  },
  {
    type: "select",
    label: "Dropdown",
    description: "Select from a list",
    icon: List,
    category: "choices",
  },
  {
    type: "switch",
    label: "Switch",
    description: "Toggle on/off",
    icon: CheckCircle2,
    category: "choices",
  },

  // Media & Files
  {
    type: "image",
    label: "Image",
    description: "Upload or display image",
    icon: ImageIcon,
    category: "media",
  },
  {
    type: "file",
    label: "File Upload",
    description: "Upload any file type",
    icon: Upload,
    category: "media",
  },
  {
    type: "video",
    label: "Video",
    description: "Embed or upload video",
    icon: Video,
    category: "media",
  },
  {
    type: "audio",
    label: "Audio",
    description: "Audio player",
    icon: Music,
    category: "media",
  },

  // Layout
  {
    type: "header",
    label: "Header",
    description: "Section title",
    icon: FileText,
    category: "layout",
  },
  {
    type: "paragraph",
    label: "Paragraph",
    description: "Static text content",
    icon: AlignLeft,
    category: "layout",
  },
  {
    type: "divider",
    label: "Divider",
    description: "Horizontal line",
    icon: Minus,
    category: "layout",
  },
  {
    type: "spacer",
    label: "Spacer",
    description: "Vertical spacing",
    icon: SeparatorHorizontal,
    category: "layout",
  },
  {
    type: "container",
    label: "Container",
    description: "Group elements",
    icon: Box,
    category: "layout",
  },
];

const CATEGORIES = [
  { id: "all", label: "All", icon: Layers },
  { id: "inputs", label: "Inputs", icon: Type },
  { id: "choices", label: "Choices", icon: CheckSquare },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "layout", label: "Layout", icon: Layout },
];

const FormAddElements: React.FC<FormAddElementsProps> = ({
  handleAddElement,
  onDragStateChange,
}) => {
  const [userWantsOpen, setUserWantsOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Calculate actual visibility based on drag state and user preference
  const isVisible = !isDragging && userWantsOpen;

  const filteredElements = useMemo(() => {
    return ELEMENT_LIBRARY.filter((item) => {
      const matchesSearch =
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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

  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    type: string
  ) => {
    event.dataTransfer.setData("application/react-dnd", type);
    event.dataTransfer.effectAllowed = "copy";
    setIsDragging(true);
    onDragStateChange?.(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragStateChange?.(false);
  };

  const PANEL_WIDTH = "min(480px, 85vw)";

  // Animation variants
  const containerVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: `calc(-1 * ${PANEL_WIDTH})`,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative">
      {/* Sidebar Container - moves as one unit */}
      <motion.div
        className="fixed top-44 left-0 z-20 inline-flex items-start"
        initial={false}
        animate={isVisible ? "open" : "closed"}
        variants={containerVariants}
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
              <motion.div
                className="grid gap-2"
                variants={listVariants}
                initial="hidden"
                animate="show"
                key={selectedCategory + searchQuery} // Re-animate when filter changes
              >
                {filteredElements.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.type}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      draggable
                      onDragStart={(e) => handleDragStart(e as any, item.type)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleAddElement(item.type)}
                      className={clsx(
                        "group relative flex items-center gap-3 rounded-xl border border-[color:var(--panel-border)] bg-[color-mix(in_lab,var(--panel-bg)_95%,white)] px-3 py-3 text-left transition-colors hover:border-[var(--accent)] hover:shadow-lg",
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
                    </motion.button>
                  );
                })}
              </motion.div>
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
      </motion.div>
    </div>
  );
};

export default FormAddElements;
