import clsx from "clsx";
import React, { useState } from "react";
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
} from "lucide-react";

export const ELEMENT_DRAG_TYPE = "application/x-form-element";

type PaletteItem = {
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
};

const ELEMENT_LIBRARY: PaletteItem[] = [
  {
    type: "input",
    label: "Text Input",
    description: "Single-line responses",
    icon: Type,
  },
  {
    type: "textarea",
    label: "Paragraph",
    description: "Longer multi-line answers",
    icon: AlignLeft,
  },
  {
    type: "select",
    label: "Dropdown",
    description: "Pick one from a list",
    icon: ListChecks,
  },
  {
    type: "radio",
    label: "Radio Group",
    description: "Single choice buttons",
    icon: RadioTower,
  },
  {
    type: "checkbox",
    label: "Checkboxes",
    description: "Select multiple options",
    icon: CheckSquare,
  },
  {
    type: "datetime-local",
    label: "Date & Time",
    description: "Schedule inputs",
    icon: CalendarClock,
  },
  {
    type: "color",
    label: "Color Picker",
    description: "Hex or swatch inputs",
    icon: Droplets,
  },
  {
    type: "range",
    label: "Slider",
    description: "Choose a value range",
    icon: SlidersHorizontal,
  },
  {
    type: "file",
    label: "File Upload",
    description: "Attach documents",
    icon: UploadCloud,
  },
  {
    type: "heading",
    label: "Section Heading",
    description: "Organize your form",
    icon: HeadingIcon,
  },
  {
    type: "paragraph",
    label: "Paragraph Info",
    description: "Helper instructions",
    icon: TextQuote,
  },
];

type FormAddElementsProps = {
  handleAddElement: (type: string) => void;
  onDragStateChange?: (active: boolean) => void;
};

const FormAddElements: React.FC<FormAddElementsProps> = ({
  handleAddElement,
  onDragStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    type: string
  ) => {
    event.dataTransfer.setData(ELEMENT_DRAG_TYPE, type);
    event.dataTransfer.effectAllowed = "copy";
    onDragStateChange?.(true);
  };

  const handleDragEnd = () => {
    onDragStateChange?.(false);
  };

  return (
    <div className="relative">
      <div className="fixed top-28 left-4 sm:left-6 z-30 inline-flex items-start gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-r-2xl bg-[var(--panel-bg)] border border-[color:var(--panel-border)] px-3 py-4 text-xs font-semibold text-[var(--text-primary)] shadow-sm hover:border-[var(--accent)] transition-base flex flex-col items-center gap-3 min-h-[140px] pointer-events-auto"
        >
          <span className="text-[var(--accent)] text-sm tracking-widest uppercase">
            {isOpen ? "Close" : "Open"}
          </span>
          <span className="-rotate-90 text-[var(--text-muted)] whitespace-nowrap tracking-wide">
            Elements
          </span>
        </button>

        <div
          className={clsx(
            "rounded-2xl border border-[color:var(--panel-border)] bg-[var(--panel-bg)] shadow-2xl p-4 w-[min(420px,80vw)] transition-all duration-300 transform origin-left pointer-events-auto",
            isOpen
              ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-x-4 scale-95 pointer-events-none"
          )}
        >
          <div className="mb-3">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Element Library
            </p>
            <p className="text-xs themed-muted">
              Drag a tile into the builder or click to add instantly.
            </p>
          </div>
          <div className="max-h-[60vh] overflow-y-auto themed-scroll pr-1">
            <div className="grid gap-3 md:grid-cols-2">
              {ELEMENT_LIBRARY.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.type)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleAddElement(item.type)}
                    className="group flex items-center gap-3 rounded-lg border border-[color:var(--panel-border)] bg-[color-mix(in_lab,var(--panel-bg)_95%,white)] px-3 py-2 text-left transition-all hover:border-[var(--accent)] hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_lab,var(--accent)_18%,white)] text-[var(--accent)] font-semibold">
                      <Icon size={18} />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {item.label}
                      </p>
                      <p className="text-xs themed-muted">{item.description}</p>
                    </div>
                    <span className="text-[var(--accent)] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Drag
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddElements;
