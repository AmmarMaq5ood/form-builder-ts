import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Plus, Trash2 } from "lucide-react";
import type { FormElement, FormElementProps } from "../FormBuilder/FormBuilder";

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow group relative"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded"
          >
            <GripVertical size={20} />
          </button>
          <div className="font-semibold text-gray-700 dark:text-gray-200 capitalize">
            {element.type}
          </div>
        </div>
        <button
          onClick={() => handleRemoveElement(element.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4 pl-10">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Label / Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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

        {!["datetime-local", "color", "checkbox", "radio", "select"].includes(
          element.type
        ) && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Placeholder
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={element.props.placeholder || ""}
                onChange={(e) =>
                  handlePropsChange(element.id, {
                    ...element.props,
                    placeholder: e.target.value,
                  })
                }
                placeholder="Enter placeholder"
              />
            </div>
          )}

        {element.type === "input" && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Input Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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

        {["select", "radio", "checkbox"].includes(element.type) && (
          <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block">
              Options
            </label>
            {element.props.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
                  className="text-gray-400 hover:text-red-500 p-1 mt-1"
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
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-2"
            >
              <Plus size={16} /> Add Option
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormElements;
