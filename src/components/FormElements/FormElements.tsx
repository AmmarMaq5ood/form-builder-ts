import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus, Trash2, HelpCircle, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { FormElement, FormElementProps } from "../FormBuilder/FormBuilder";

type FieldHintProps = {
  children: React.ReactNode;
};

const FieldHint: React.FC<FieldHintProps> = ({ children }) => (
  <p className="flex items-center gap-1 text-xs themed-muted">
    <HelpCircle size={12} className="shrink-0" />
    <span>{children}</span>
  </p>
);

type FormElementsProps = {
  element: FormElement;
  handlePropsChange: (id: string, newProps: FormElementProps) => void;
  handleRemoveElement: (id: string) => void;
  handleRemoveOption: (elementId: string, optionIndex: number) => void;
};

const FormElements: React.FC<FormElementsProps> = ({
  element,
  handlePropsChange,
  handleRemoveElement,
  handleRemoveOption,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const summaryBits: string[] = [];
  if (element.props.placeholder) {
    summaryBits.push(`Placeholder: ${element.props.placeholder}`);
  }
  if (["select", "radio", "checkbox"].includes(element.type)) {
    summaryBits.push(`${element.props.options?.length || 0} option(s)`);
  }
  if (element.type === "input" && element.props.input_type) {
    summaryBits.push(`Type: ${element.props.input_type}`);
  }
  if (element.props.required) {
    summaryBits.push("Required");
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="themed-card border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow transition-base group relative"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded transition-base"
            aria-label="Drag to reorder"
          >
            <GripVertical size={20} />
          </button>
          <div>
            <div className="font-semibold text-[var(--text-primary)] capitalize">
              {element.type}
            </div>
            <div className="text-xs themed-muted">
              {element.props.name || "Untitled field"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1.5 rounded border border-[color:var(--panel-border)] text-[var(--text-muted)] hover:bg-[color-mix(in_lab,var(--panel-border),var(--panel-bg))] transition-colors"
            aria-label={isCollapsed ? "Expand field" : "Collapse field"}
          >
            <ChevronDown
              size={16}
              className={`transition-transform ${
                isCollapsed ? "-rotate-90" : ""
              }`}
            />
          </button>
          <button
            onClick={() => handleRemoveElement(element.id)}
            className="text-[var(--text-muted)] hover:text-red-500 transition-colors p-1 rounded"
            aria-label="Remove field"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {isCollapsed ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-10 text-xs themed-muted overflow-hidden"
          >
            {summaryBits.length > 0
              ? summaryBits.join(" • ")
              : "No configuration yet."}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 pl-10 overflow-hidden"
          >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            Label / Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
            value={element.props.name}
            onChange={(e) =>
              handlePropsChange(element.id, {
                ...element.props,
                name: e.target.value,
              })
            }
            placeholder="Enter label"
          />
        </div>

        {![
          "datetime-local",
          "color",
          "checkbox",
          "radio",
          "select",
          "range",
          "file",
          "heading",
          "paragraph",
        ].includes(element.type) && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Placeholder
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
                value={element.props.placeholder || ""}
                onChange={(e) =>
                  handlePropsChange(element.id, {
                    ...element.props,
                    placeholder: e.target.value,
                  })
                }
                placeholder="Enter placeholder"
              />
              <FieldHint>Placeholders appear inside empty inputs.</FieldHint>
            </div>
          )}

        {[
          "input",
          "textarea",
          "select",
          "radio",
          "checkbox",
          "datetime-local",
          "color",
          "range",
          "file",
        ].includes(element.type) && (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Helper Text
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]  min-h-[60px]"
                  value={element.props.helperText || ""}
                  onChange={(e) =>
                    handlePropsChange(element.id, {
                      ...element.props,
                      helperText: e.target.value,
                    })
                  }
                  placeholder="Provide extra guidance for this field"
                />
                <FieldHint>
                  Helper text is displayed below the field to guide respondents.
                </FieldHint>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <input
                  type="checkbox"
                  checked={Boolean(element.props.required)}
                  onChange={(e) =>
                    handlePropsChange(element.id, {
                      ...element.props,
                      required: e.target.checked,
                    })
                  }
                className="rounded border-[color:var(--panel-border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                Required field
              </label>
            </div>
          )}

        {element.type === "input" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Input Type
            </label>
            <select
              className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
              value={element.props.input_type}
              onChange={(e) =>
                handlePropsChange(element.id, {
                  ...element.props,
                  input_type: e.target.value,
                })
              }
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
            </select>
          </div>
        )}

        {["input", "textarea", "datetime-local", "color"].includes(
          element.type
        ) && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Default Value
              </label>
              <input
                type={
                  element.type === "color"
                    ? "color"
                    : element.type === "datetime-local"
                      ? "datetime-local"
                      : "text"
                }
                className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
                value={element.props.defaultValue || ""}
                onChange={(e) =>
                  handlePropsChange(element.id, {
                    ...element.props,
                    defaultValue: e.target.value,
                  })
                }
              />
              <FieldHint>Leave blank to start with an empty value.</FieldHint>
            </div>
          )}

        {["select", "radio"].includes(element.type) &&
          (element.props.options?.length ?? 0) > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Default Selection
              </label>
              <select
                className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
                value={element.props.defaultValue || ""}
                onChange={(e) =>
                  handlePropsChange(element.id, {
                    ...element.props,
                    defaultValue: e.target.value,
                  })
                }
              >
                <option value="">None</option>
                {element.props.options?.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label || option.value || `Option ${idx + 1}`}
                  </option>
                ))}
              </select>
              <FieldHint>
                The selected option will be pre-filled in the preview.
              </FieldHint>
            </div>
          )}

        {element.type === "checkbox" &&
          (element.props.options?.length ?? 0) > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Default Checked Options
              </label>
              <div className="space-y-1">
                {element.props.options?.map((option, idx) => {
                  const defaults = element.props.defaultValues || [];
                  const checked = defaults.includes(option.value);
                  return (
                    <label
                      key={idx}
                      className="inline-flex items-center gap-2 text-sm text-[var(--text-primary)]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const nextDefaults = new Set(defaults);
                          if (e.target.checked) {
                            nextDefaults.add(option.value);
                          } else {
                            nextDefaults.delete(option.value);
                          }
                          handlePropsChange(element.id, {
                            ...element.props,
                            defaultValues:
                              Array.from(nextDefaults).filter(Boolean).length > 0
                                ? Array.from(nextDefaults).filter(Boolean)
                                : undefined,
                          });
                        }}
                        className="rounded border-[color:var(--panel-border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      <span>{option.label || option.value || `Option ${idx + 1}`
                        }</span>
                    </label>
                  );
                })}
              </div>
              <FieldHint>
                Choose which options start checked for respondents.
              </FieldHint>
            </div>
          )}

        {["input", "textarea"].includes(element.type) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["minLength", "maxLength"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  {field === "minLength" ? "Min Length" : "Max Length"}
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
                  value={element.props[field as "minLength" | "maxLength"] ?? ""}
                  onChange={(e) =>
                    handlePropsChange(element.id, {
                      ...element.props,
                      [field]:
                        e.target.value === "" ? undefined : Number(e.target.value),
                    })
                  }
                />
              </div>
            ))}
            {element.type === "input" && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Pattern (RegEx)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
                  value={element.props.pattern || ""}
                  onChange={(e) =>
                    handlePropsChange(element.id, {
                      ...element.props,
                      pattern: e.target.value,
                    })
                  }
                  placeholder="e.g. ^[A-Za-z]+$"
                />
              </div>
            )}
            <div className="sm:col-span-3">
              <FieldHint>
                Validation rules are enforced in the live preview and saved JSON.
              </FieldHint>
            </div>
          </div>
        )}

        {element.type === "input" && element.props.input_type === "number" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {["min", "max", "step"].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text-primary)] capitalize">
                  {field}
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
                  value={
                    element.props[field as "min" | "max" | "step"] ?? ""
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value);
                    handlePropsChange(element.id, {
                      ...element.props,
                      [field]: value,
                    });
                  }}
                />
              </div>
            ))}
            <div className="sm:col-span-3">
              <FieldHint>
                Leave min/max blank to accept any numeric value.
              </FieldHint>
            </div>
          </div>
        )}

        {element.type === "range" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["min", "max", "step"].map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--text-primary)] capitalize">
                    {field}
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
                    value={
                      element.props[field as "min" | "max" | "step"] ?? ""
                    }
                    onChange={(e) => {
                      const value =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      handlePropsChange(element.id, {
                        ...element.props,
                        [field]: value,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Default Value
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
                value={element.props.defaultValue ?? ""}
                onChange={(e) =>
                  handlePropsChange(element.id, {
                    ...element.props,
                    defaultValue: e.target.value,
                  })
                }
              />
              <FieldHint>
                Slider defaults should fall between the min and max values.
              </FieldHint>
            </div>
          </div>
        )}

        {element.type === "file" && (
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Accepted Types (e.g. .pdf,image/*)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] "
                value={element.props.accept || ""}
                onChange={(e) =>
                  handlePropsChange(element.id, {
                    ...element.props,
                    accept: e.target.value,
                  })
                }
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-[var(--text-primary)]">
              <input
                type="checkbox"
                checked={Boolean(element.props.multiple)}
                onChange={(e) =>
                  handlePropsChange(element.id, {
                    ...element.props,
                    multiple: e.target.checked,
                  })
                }
                className="rounded border-[color:var(--panel-border)] text-[var(--accent)] focus:ring-[var(--accent)]"
              />
              Allow multiple files
            </label>
          </div>
        )}

        {["heading", "paragraph"].includes(element.type) && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Content
            </label>
            <textarea
              className="w-full px-3 py-2 border border-[color:var(--panel-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]  min-h-[80px]"
              value={element.props.content || ""}
              onChange={(e) =>
                handlePropsChange(element.id, {
                  ...element.props,
                  content: e.target.value,
                })
              }
              placeholder={
                element.type === "heading"
                  ? "Section heading text..."
                  : "Paragraph content..."
              }
            />
          </div>
        )}

        {["select", "radio", "checkbox"].includes(element.type) && (
          <div className="space-y-3 bg-[color-mix(in_lab,var(--panel-bg)_90%,white)] p-3 rounded-md">
            <label className="text-sm font-medium text-[var(--text-primary)] block">
              Options
            </label>
            {(element.props.options?.length ?? 0) === 0 && (
              <div className="rounded-md border border-dashed border-[color:var(--panel-border)] p-3 text-xs themed-muted bg-[color-mix(in_lab,var(--panel-bg)_80%,white)]">
                Start by adding at least one option to enable this field in the
                preview.
              </div>
            )}
            {element.props.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-sm border border-[color:var(--panel-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)] "
                    value={option.label}
                    placeholder="Label"
                    onChange={(e) => {
                      const newOptions = [...(element.props.options || [])];
                      newOptions[optionIndex] = {
                        ...option,
                        label: e.target.value,
                      };
                      handlePropsChange(element.id, {
                        ...element.props,
                        options: newOptions,
                      });
                    }}
                  />
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-sm border border-[color:var(--panel-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)] "
                    value={option.value}
                    placeholder="Value"
                    onChange={(e) => {
                      const newOptions = [...(element.props.options || [])];
                      newOptions[optionIndex] = {
                        ...option,
                        value: e.target.value,
                      };
                      handlePropsChange(element.id, {
                        ...element.props,
                        options: newOptions,
                      });
                    }}
                  />
                </div>
                <button
                  onClick={() => handleRemoveOption(element.id, optionIndex)}
                  className="text-[var(--text-muted)] hover:text-red-500 p-1 mt-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                handlePropsChange(element.id, {
                  ...element.props,
                  options: [
                    ...(element.props.options || []),
                    { label: "", value: "" },
                  ],
                })
              }
              className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1 mt-2"
            >
              <Plus size={16} /> Add Option
            </button>
          </div>
        )}
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormElements;
