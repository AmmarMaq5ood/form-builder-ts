import React, { useState, useRef } from "react";
import FileSaver from "file-saver";
import { Upload, Save } from "lucide-react";
import type { FormElement } from "../FormBuilder/FormBuilder";

type FormPreviewProps = {
  elements: FormElement[];
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  updateElements: (newElements: FormElement[]) => void;
};

const FormPreview: React.FC<FormPreviewProps> = ({
  elements,
  handleSubmit,
  updateElements,
}) => {
  const [inputValues, setInputValues] = useState<
    Record<string, string | string[]>
  >({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const dataToSave = {
      elements: elements,
      inputValues: inputValues,
    };
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    let saveFormName = "form.json";
    if (inputValues && inputValues.formName) {
      saveFormName = inputValues.formName.toString() + ".json";
    }
    FileSaver.saveAs(blob, saveFormName);
  };

  const loadForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const ext = file.name.split(".").pop();

      if (ext !== "json") {
        alert("Please load a JSON file, no other file will be accepted!");
        return;
      }

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const content = fileReader.result;
        if (content) {
          try {
            const parsedContent = JSON.parse(content.toString());
            if (parsedContent.elements) {
              updateElements(parsedContent.elements);
              setInputValues(parsedContent.inputValues || {});
            } else {
              alert("Invalid form file format");
            }
          } catch (error) {
            console.error("Error parsing JSON", error);
            alert("Error parsing JSON file");
          }
        }
      };
      fileReader.readAsText(file);
    }
    event.target.value = "";
  };

  const handleInputChange = (name: string, value: string | string[]) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        {elements.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="mb-4">Add elements to see the preview...</p>
            <div className="flex justify-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={loadForm}
                className="hidden"
                accept=".json"
              />
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                Load Form
              </button>
            </div>
          </div>
        ) : (
          <>
            {elements.map((element) => (
              <div key={element.id} className="space-y-2">
                {element.type === "input" && (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={element.props.name}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {element.props.name}
                    </label>
                    <input
                      id={element.props.name}
                      name={element.props.name}
                      placeholder={element.props.placeholder}
                      type={element.props.input_type || "text"}
                      value={(inputValues[element.props.name] as string) || ""}
                      onChange={(e) =>
                        handleInputChange(element.props.name, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                )}
                {element.type === "textarea" && (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={element.props.name}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {element.props.name}
                    </label>
                    <textarea
                      id={element.props.name}
                      name={element.props.name}
                      placeholder={element.props.placeholder}
                      value={(inputValues[element.props.name] as string) || ""}
                      onChange={(e) =>
                        handleInputChange(element.props.name, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white min-h-[100px]"
                    />
                  </div>
                )}
                {element.type === "select" && (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={element.props.name}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {element.props.name}
                    </label>
                    <select
                      id={element.props.name}
                      value={(inputValues[element.props.name] as string) || ""}
                      onChange={(e) =>
                        handleInputChange(element.props.name, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select an Option</option>
                      {element.props.options?.map((option, idx) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {element.type === "radio" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {element.props.name}
                    </label>
                    <div className="space-y-2">
                      {element.props.options?.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={`${element.props.name}-${idx}`}
                            name={element.props.name}
                            value={option.value}
                            checked={
                              (inputValues[element.props.name] as string) ===
                              option.value
                            }
                            onChange={(e) =>
                              handleInputChange(
                                element.props.name,
                                e.target.value
                              )
                            }
                            className="text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`${element.props.name}-${idx}`}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {element.type === "checkbox" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {element.props.name}
                    </label>
                    <div className="space-y-2">
                      {element.props.options?.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`${element.props.name}-${idx}`}
                            value={option.value}
                            checked={
                              Array.isArray(inputValues[element.props.name]) &&
                              (
                                inputValues[element.props.name] as string[]
                              ).includes(option.value)
                            }
                            onChange={(e) => {
                              const selectedValues =
                                (inputValues[element.props.name] as string[]) ||
                                [];
                              let updatedValues: string[];
                              if (e.target.checked) {
                                updatedValues = [...selectedValues, option.value];
                              } else {
                                updatedValues = selectedValues.filter(
                                  (val) => val !== option.value
                                );
                              }
                              handleInputChange(
                                element.props.name,
                                updatedValues
                              );
                            }}
                            className="text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 rounded"
                          />
                          <label
                            htmlFor={`${element.props.name}-${idx}`}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {element.type === "datetime-local" && (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={element.props.name}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {element.props.name}
                    </label>
                    <input
                      type="datetime-local"
                      id={element.props.name}
                      name={element.props.name}
                      value={(inputValues[element.props.name] as string) || ""}
                      onChange={(e) =>
                        handleInputChange(element.props.name, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                )}
                {element.type === "color" && (
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={element.props.name}
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {element.props.name}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        id={element.props.name}
                        name={element.props.name}
                        value={
                          (inputValues[element.props.name] as string) ||
                          "#000000"
                        }
                        onChange={(e) =>
                          handleInputChange(element.props.name, e.target.value)
                        }
                        className="h-10 w-20 p-1 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                      />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {inputValues[element.props.name] || "#000000"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="formName"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Form Name
                </label>
                <input
                  id="formName"
                  type="text"
                  placeholder="Enter form name to save"
                  value={(inputValues["formName"] as string) || ""}
                  onChange={(e) => handleInputChange("formName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveForm}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                >
                  <Save size={18} />
                  Save JSON
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={loadForm}
                  className="hidden"
                  accept=".json"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
                >
                  <Upload size={18} />
                  Load JSON
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default FormPreview;
