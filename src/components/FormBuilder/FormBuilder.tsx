import { useEffect, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  type DragMoveEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import FormAddElements, {
  ELEMENT_DRAG_TYPE,
} from "../FormAddElements/FormAddElements";
import FormElements from "../FormElements/FormElements";
import FormPreview from "../FormPreview/FormPreview";

export type FormElementProps = {
  name: string;
  placeholder?: string;
  input_type?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string;
  defaultValues?: string[];
  content?: string;
  accept?: string;
  multiple?: boolean;
  helperText?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

export type FormElement = {
  id: string;
  type: string;
  props: FormElementProps;
};

const FormBuilder = () => {
  const [elements, setElements] = useState<FormElement[]>([]);
  const [panelRatio, setPanelRatio] = useState(0.55);
  const [isResizing, setIsResizing] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [isPaletteDragActive, setIsPaletteDragActive] = useState(false);
  const [isPaletteHovering, setIsPaletteHovering] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const builderScrollRef = useRef<HTMLDivElement>(null);
  const previewPaneRef = useRef<HTMLDivElement>(null);
  const previewViewportRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const handlePointerMove = (event: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0) return;
      const nextRatio = (event.clientX - rect.left) / rect.width;
      setPanelRatio(Math.min(0.75, Math.max(0.35, nextRatio)));
    };

    const stopResizing = () => setIsResizing(false);

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", stopResizing);
    window.addEventListener("mouseleave", stopResizing);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("mouseleave", stopResizing);
    };
  }, [isResizing]);

  const clampScale = (value: number) => Math.min(1.3, Math.max(0.6, value));

  const handleZoom = (direction: "in" | "out") => {
    setPreviewScale((prev) =>
      clampScale(prev + (direction === "in" ? 0.1 : -0.1))
    );
  };

  const handleZoomSlider = (value: string) => {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      setPreviewScale(clampScale(parsed));
    }
  };

  const handleZoomToFit = () => {
    const availableWidth =
      previewViewportRef.current?.clientWidth ||
      previewPaneRef.current?.clientWidth ||
      0;
    if (!availableWidth) return;
    const baseWidth = 640;
    const computedScale = clampScale(availableWidth / baseWidth);
    setPreviewScale(Number(computedScale.toFixed(2)));
  };

  const handleAddElement = (elementType: string) => {
    if (!elementType) return;
    let newProps: FormElementProps;
    const baseProps: FormElementProps = {
      name: "",
      placeholder: "",
      helperText: "",
      required: false,
      defaultValue: "",
    };

    if (elementType === "checkbox") {
      newProps = {
        ...baseProps,
        options: [],
        defaultValues: [],
      };
    } else if (["select", "radio"].includes(elementType)) {
      newProps = {
        ...baseProps,
        options: [],
      };
    } else if (elementType === "input") {
      newProps = {
        ...baseProps,
        input_type: "text",
      };
    } else if (["color", "datetime-local"].includes(elementType)) {
      newProps = {
        ...baseProps,
      };
    } else if (elementType === "range") {
      newProps = {
        ...baseProps,
        min: 0,
        max: 100,
        step: 1,
        defaultValue: "50",
      };
    } else if (elementType === "file") {
      newProps = {
        ...baseProps,
        accept: "",
        multiple: false,
      };
    } else if (elementType === "heading") {
      newProps = {
        name: "Section title",
        content: "Describe this section",
        helperText: "",
        required: false,
      };
    } else if (elementType === "paragraph") {
      newProps = {
        name: "",
        content: "Add helpful instructions for the user.",
        helperText: "",
        required: false,
      };
    } else {
      newProps = {
        ...baseProps,
      };
    }

    const newElement: FormElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: elementType,
      props: newProps,
    };
    setElements([...elements, newElement]);
  };

  const handlePropsChange = (id: string, newProps: FormElementProps) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, props: newProps } : el))
    );
  };

  const handleRemoveElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("Form Submitted", elements);
    alert("Form Submitted! Check console for data.");
  };

  const handleRemoveOption = (elementId: string, optionIndex: number) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === elementId && el.props.options) {
          const optionToRemove = el.props.options[optionIndex];
          const newOptions = [...el.props.options];
          newOptions.splice(optionIndex, 1);
          const updatedProps: FormElementProps = {
            ...el.props,
            options: newOptions,
          };
          if (optionToRemove?.value) {
            if (el.props.defaultValues) {
              const remainingDefaults =
                el.props.defaultValues.filter(
                  (val) => val !== optionToRemove.value
                ) || [];
              updatedProps.defaultValues =
                remainingDefaults.length > 0 ? remainingDefaults : undefined;
            }
            if (el.props.defaultValue === optionToRemove.value) {
              updatedProps.defaultValue = "";
            }
          }
          return { ...el, props: updatedProps };
        }
        return el;
      })
    );
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const scrollContainer = builderScrollRef.current;
    if (!scrollContainer) return;

    const pointerEvent =
      (event.activatorEvent as MouseEvent | TouchEvent | undefined) || undefined;
    let pointerY: number | null = null;

    if (pointerEvent instanceof TouchEvent) {
      pointerY = pointerEvent.touches[0]?.clientY ?? null;
    } else if (pointerEvent instanceof MouseEvent) {
      pointerY = pointerEvent.clientY;
    }

    if (pointerY == null) return;

    const rect = scrollContainer.getBoundingClientRect();
    const EDGE_THRESHOLD = 80;
    const SCROLL_STEP = 18;

    if (pointerY - rect.top < EDGE_THRESHOLD) {
      scrollContainer.scrollTop -= SCROLL_STEP;
    } else if (rect.bottom - pointerY < EDGE_THRESHOLD) {
      scrollContainer.scrollTop += SCROLL_STEP;
    }
  };

  const handlePaletteDragStateChange = (active: boolean) => {
    setIsPaletteDragActive(active);
    if (!active) {
      setIsPaletteHovering(false);
    }
  };

  const handlePaletteDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isPaletteDragActive) return;
    event.preventDefault();
    setIsPaletteHovering(true);
    event.dataTransfer.dropEffect = "copy";
  };

  const handlePaletteDragLeave = () => {
    setIsPaletteHovering(false);
  };

  const handlePaletteDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isPaletteDragActive) return;
    event.preventDefault();
    const elementType = event.dataTransfer.getData(ELEMENT_DRAG_TYPE);
    if (elementType) {
      handleAddElement(elementType);
    }
    setIsPaletteHovering(false);
    setIsPaletteDragActive(false);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateElements = (newElements: FormElement[]) => {
    setElements(newElements);
  };

  const showDropHints = elements.length === 0;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-6 ${isResizing ? "select-none" : ""}`}
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 items-stretch">
        {/* Builder Section */}
        <div
          className="flex-1 min-w-0"
          style={{ flexBasis: `${panelRatio * 100}%` }}
        >
          <div className="themed-panel rounded-xl shadow-lg p-6 border h-full flex flex-col transition-base">
            <div className="mb-6 border-b border-[color:var(--panel-border)] pb-4">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                Builder
              </h2>
              <p className="text-sm themed-muted">
                Configure your form elements and drag to arrange
              </p>
            </div>

            <div className="mb-6">
              <FormAddElements
                handleAddElement={handleAddElement}
                onDragStateChange={handlePaletteDragStateChange}
              />
            </div>

            <div className="mb-4 rounded-lg border themed-tip p-4 text-xs flex items-start gap-2 transition-base">
              <span className="font-semibold">Tip:</span>
              <span>
                Drop elements anywhere inside the canvas below. Reorder with the
                handle or duplicate their settings from the property cards.
              </span>
            </div>

            <div
              className={clsx(
                "space-y-4 flex-1 overflow-auto rounded-xl transition-base",
                (isPaletteDragActive || isPaletteHovering) &&
                "ring-2 ring-dashed ring-[var(--accent)] bg-[color-mix(in_lab,var(--panel-bg)_95%,white)]"
              )}
              ref={builderScrollRef}
              onDragOver={handlePaletteDragOver}
              onDragLeave={handlePaletteDragLeave}
              onDrop={handlePaletteDrop}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
              >
                <SortableContext
                  items={elements.map((el) => el.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <AnimatePresence mode="wait">
                    {showDropHints ? (
                      <motion.div
                        key="empty-state"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-lg border-2 border-dashed border-[color:var(--panel-border)]/70 p-8 text-center themed-muted transition-base"
                      >
                        <p className="mb-6 font-medium">
                          No elements yet—start by adding one above or drag from
                          the list.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-3">
                          {[
                            { title: "Text Input", description: "Collect short answers" },
                            { title: "Select", description: "Offer predefined choices" },
                            { title: "Checkboxes", description: "Allow multi-select" },
                          ].map(({ title, description }, idx) => (
                            <motion.div
                              key={title}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + idx * 0.05 }}
                              className="rounded-lg border themed-card p-3 shadow-sm text-left transition-base"
                            >
                              <p className="text-sm font-semibold text-[var(--text-primary)]">
                                {title}
                              </p>
                              <p className="text-xs themed-muted">
                                {description}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="element-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {elements.map((element) => (
                          <FormElements
                            key={element.id}
                            element={element}
                            handlePropsChange={handlePropsChange}
                            handleRemoveElement={handleRemoveElement}
                            handleRemoveOption={handleRemoveOption}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>

        {/* Resizer */}
        <div
          className="hidden lg:flex items-stretch px-1 cursor-col-resize select-none"
          onMouseDown={() => setIsResizing(true)}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
        >
          <div
            className={`w-1 rounded-full transition-colors ${isResizing ? "bg-[var(--accent)]" : "bg-[color:var(--panel-border)]"
              }`}
          />
        </div>

        {/* Preview Section */}
        <div
          className="flex-1 min-w-0"
          style={{ flexBasis: `${(1 - panelRatio) * 100}%` }}
          ref={previewPaneRef}
        >
          <div className="themed-panel rounded-xl shadow-lg p-6 border sticky top-4 h-fit transition-base">
            <div className="mb-4 flex flex-wrap gap-3 items-center justify-between border-b border-[color:var(--panel-border)] pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  Preview
                </h2>
                <p className="text-sm themed-muted">
                  See how your form looks at different zoom levels
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm themed-muted">
                <button
                  type="button"
                  onClick={() => handleZoom("out")}
                  className="p-2 rounded-lg border border-[color:var(--panel-border)] hover:bg-[color-mix(in_lab,var(--panel-border),var(--panel-bg))] transition-colors"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>
                <input
                  type="range"
                  min="0.6"
                  max="1.3"
                  step="0.05"
                  value={previewScale}
                  onChange={(e) => handleZoomSlider(e.target.value)}
                  className="w-24 accent-blue-600"
                  aria-label="Preview zoom level"
                />
                <button
                  type="button"
                  onClick={() => handleZoom("in")}
                  className="p-2 rounded-lg border border-[color:var(--panel-border)] hover:bg-[color-mix(in_lab,var(--panel-border),var(--panel-bg))] transition-colors"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomToFit}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[color:var(--panel-border)] hover:bg-[color-mix(in_lab,var(--panel-border),var(--panel-bg))] transition-colors"
                >
                  <Maximize2 size={16} />
                  Fit
                </button>
              </div>
            </div>

            <div
              ref={previewViewportRef}
              className="overflow-auto rounded-lg border border-[color:var(--panel-border)] p-4 bg-[color-mix(in_lab,var(--panel-bg)_85%,white)] transition-base"
              data-preview-viewport
            >
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
                className="origin-top-left"
              >
                <FormPreview
                  elements={elements}
                  handleSubmit={handleSubmit}
                  updateElements={updateElements}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
