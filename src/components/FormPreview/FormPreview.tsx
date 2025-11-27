import React, { useState, useRef, useEffect } from "react";
import FileSaver from "file-saver";
import { Upload, Save } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

  useEffect(() => {
    setInputValues((prev) => {
      const next = { ...prev };
      let changed = false;
      const validKeys = new Set(
        elements
          .map((el) => el.props.name)
          .filter((name): name is string => Boolean(name))
      );
      Object.keys(next).forEach((key) => {
        if (key === "formName") {
          return;
        }
        if (!validKeys.has(key)) {
          delete next[key];
          changed = true;
        }
      });
      elements.forEach((element) => {
        const key = element.props.name;
        if (!key) {
          return;
        }
        if (element.type === "checkbox") {
          const hasValue =
            Array.isArray(next[key]) && (next[key] as string[]).length > 0;
          if (!hasValue && element.props.defaultValues?.length) {
            next[key] = element.props.defaultValues;
            changed = true;
          }
        } else if (
          next[key] === undefined &&
          element.props.defaultValue !== undefined &&
          element.props.defaultValue !== ""
        ) {
          next[key] = element.props.defaultValue;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [elements]);

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
    <div className="themed-card p-6 rounded-lg border transition-base">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {elements.length === 0 ? (
            <motion.div
              key="empty-preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="text-center py-12 themed-muted"
            >
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
                  className="flex items-center gap-2 px-4 py-2 border border-[color:var(--panel-border)] rounded-lg hover:bg-[color-mix(in_lab,var(--panel-border),var(--panel-bg))] transition-colors text-sm font-medium text-[var(--text-primary)]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  Load Form
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <AnimatePresence>
                {elements.map((element) => {
                  const fieldValue =
                    (inputValues[element.props.name] as string) ??
                    element.props.defaultValue ??
                    "";
                  const checkboxValues =
                    element.type === "checkbox"
                      ? Array.isArray(inputValues[element.props.name])
                        ? (inputValues[element.props.name] as string[])
                        : element.props.defaultValues || []
                      : [];
                  return (
                    <motion.div
                      key={element.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      {element.type === "heading" && (
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          {element.props.content || element.props.name}
                        </h3>
                      )}
                      {element.type === "paragraph" && (
                        <p className="text-sm themed-muted">
                          {element.props.content}
                        </p>
                      )}
                      {element.type === "input" && (
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor={element.props.name}
                            className="text-sm font-medium text-[var(--text-primary)]"
                          >
                            {element.props.name}
                          </label>
                          <input
                            id={element.props.name}
                            name={element.props.name}
                            placeholder={element.props.placeholder}
                            type={element.props.input_type || "text"}
                            value={fieldValue}
                            required={element.props.required}
                            minLength={
                              element.props.input_type === "number"
                                ? undefined
                                : element.props.minLength
                            }
                            maxLength={
                              element.props.input_type === "number"
                                ? undefined
                                : element.props.maxLength
                            }
                            pattern={
                              element.props.input_type === "number"
                                ? undefined
                                : element.props.pattern
                            }
                            min={
                              element.props.input_type === "number"
                                ? element.props.min
                                : undefined
                            }
                            max={
                              element.props.input_type === "number"
                                ? element.props.max
                                : undefined
                            }
                            step={
                              element.props.input_type === "number"
                                ? element.props.step
                                : undefined
                            }
                            onChange={(e) =>
                              handleInputChange(element.props.name, e.target.value)
                            }
                            className="form-field"
                          />
                          {element.props.helperText && (
                            <p className="text-xs themed-muted">
                              {element.props.helperText}
                            </p>
                          )}
                        </div>
                      )}
                      {element.type === "range" && (
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor={element.props.name}
                            className="text-sm font-medium text-[var(--text-primary)]"
                          >
                            {element.props.name}
                          </label>
                          {(() => {
                            const sliderValue =
                              fieldValue || String(element.props.min ?? 0);
                            return (
                              <>
                                <input
                                  type="range"
                                  id={element.props.name}
                                  name={element.props.name}
                                  min={element.props.min}
                                  max={element.props.max}
                                  step={element.props.step}
                                  value={sliderValue}
                                  required={element.props.required}
                                  onChange={(e) =>
                                    handleInputChange(
                                      element.props.name,
                                      e.target.value
                                    )
                                  }
                                  className="accent-blue-600"
                                />
                                <span className="text-xs themed-muted">
                                  {sliderValue}
                                </span>
                              </>
                            );
                          })()}
                          {element.props.helperText && (
                            <p className="text-xs themed-muted">
                              {element.props.helperText}
                            </p>
                          )}
                        </div>
                      )}
                      {element.type === "file" && (
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor={element.props.name}
                            className="text-sm font-medium text-[var(--text-primary)]"
                          >
                            {element.props.name}
                          </label>
                          <input
                            type="file"
                            id={element.props.name}
                            name={element.props.name}
                            accept={element.props.accept}
                            multiple={Boolean(element.props.multiple)}
                            required={element.props.required}
                            onChange={(e) => {
                              const files = e.target.files
                                ? Array.from(e.target.files).map((file) => file.name)
                                : [];
                              handleInputChange(element.props.name, files);
                            }}
                            className="text-sm text-[var(--text-primary)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[color-mix(in_lab,var(--accent)_20%,white)] file:text-[var(--accent)] hover:file:bg-[color-mix(in_lab,var(--accent)_30%,white)]"
                          />
                          {Array.isArray(inputValues[element.props.name]) &&
                            (inputValues[element.props.name] as string[]).length >
                            0 && (
                              <ul className="text-xs themed-muted list-disc pl-4">
                                {(inputValues[element.props.name] as string[]).map(
                                  (fileName) => (
                                    <li key={fileName}>{fileName}</li>
                                  )
                                )}
                              </ul>
                            )}
                          {element.props.helperText && (
                            <p className="text-xs themed-muted">
                              {element.props.helperText}
                            </p>
                          )}
                        </div>
                      )}
                      {element.type === "textarea" && (
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor={element.props.name}
                            className="text-sm font-medium text-[var(--text-primary)]"
                          >
                            {element.props.name}
                          </label>
                          <textarea
                            id={element.props.name}
                            name={element.props.name}
                            placeholder={element.props.placeholder}
                            value={fieldValue}
                            required={element.props.required}
                            minLength={element.props.minLength}
                            maxLength={element.props.maxLength}
                            onChange={(e) =>
                              handleInputChange(element.props.name, e.target.value)
                            }
                            className="form-field min-h-[100px]"
                          />
                          {element.props.helperText && (
                            <p className="text-xs themed-muted">
                              {element.props.helperText}
                            </p>
                          )}
                        </div>
                      )}
                      {element.type === "select" && (
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor={element.props.name}
                            className="text-sm font-medium text-[var(--text-primary)]"
                          >
                            {element.props.name}
                          </label>
                          <select
                            id={element.props.name}
                            value={fieldValue}
                            required={element.props.required}
                            onChange={(e) =>
                              handleInputChange(element.props.name, e.target.value)
                            }
                            className="form-field"
                          >
                            <option value="">Select an Option</option>
                            {element.props.options?.map((option, idx) => (
                              <option key={idx} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {element.props.helperText && (
                            <p className="text-xs themed-muted">
                              {element.props.helperText}
                            </p>
                          )}
                        </div>
                      )}
                      {element.type === "radio" && (
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-[var(--text-primary)]">
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
                                  checked={fieldValue === option.value}
                                  required={
                                    element.props.required &&
                                    fieldValue === "" &&
                                    idx === 0
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      element.props.name,
                                      e.target.value
                                    )
                                  }
                                  className="text-[var(--accent)] focus:ring-[var(--accent)]"
                                />
                                <label
                                  htmlFor={`${element.props.name}-${idx}`}
                                  className="text-sm text-[var(--text-primary)]"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                          {element.props.helperText && (
                            <p className="text-xs themed-muted">
                              {element.props.helperText}
                            </p>
                          )}
                        </div>
                      )}
                      {element.type === "checkbox" && (
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-[var(--text-primary)]">
                            {element.props.name}
                          </label>
                          <div className="space-y-2">
                            {element.props.options?.map((option, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`${element.props.name}-${idx}`}
                                  value={option.value}
                                  checked={checkboxValues.includes(option.value)}
                                  required={
                                    element.props.required &&
                                    checkboxValues.length === 0 &&
                                    idx === 0
                                  }
                                  onChange={(e) => {
                                    const selectedValues = checkboxValues || [];
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
                                  className="text-[var(--accent)] focus:ring-[var(--accent)] rounded"
                                />
                                <label
                                  htmlFor={`${element.props.name}-${idx}`}
                                  className="text-sm text-[var(--text-primary)]"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                          {element.props.helperText && (
                            <p className="text-xs themed-muted">
                              {element.props.helperText}
                            </p>
                          )}
                        </div>
                      )}
                      {element.type === "datetime-local" && (
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor={element.props.name}
                            className="text-sm font-medium text-[var(--text-primary)]"
                          >
                            {element.props.name}
                          </label>
                          <input
                            type="datetime-local"
                            id={element.props.name}
                            name={element.props.name}
                            value={fieldValue}
                            required={element.props.required}
                            onChange={(e) =>
                              handleInputChange(element.props.name, e.target.value)
                            }
                            className="form-field"
                          />
                          {element.props.helperText && (
                            <p className="text-xs themed-muted">
                              {element.props.helperText}
                            </p>
                          )}
                        </div>
                      )}
                      {element.type === "color" && (
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor={element.props.name}
                            className="text-sm font-medium text-[var(--text-primary)]"
                          >
                            {element.props.name}
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              id={element.props.name}
                              name={element.props.name}
                              value={fieldValue || "#000000"}
                              required={element.props.required}
                              onChange={(e) =>
                                handleInputChange(element.props.name, e.target.value)
                              }
                              className="h-10 w-20 p-1 border border-[color:var(--panel-border)] rounded-md cursor-pointer"
                            />
                            <span className="text-sm themed-muted">
                              {fieldValue || "#000000"}
                            </span>
                          </div>
                          {element.props.helperText && (
                            <p className="text-xs themed-muted">
                              {element.props.helperText}
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <div className="pt-6 border-t border-[color:var(--panel-border)] space-y-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="formName"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    Form Name
                  </label>
                  <input
                    id="formName"
                    type="text"
                    placeholder="Enter form name to save"
                    value={(inputValues["formName"] as string) || ""}
                    onChange={(e) => handleInputChange("formName", e.target.value)}
                    className="form-field"
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
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--panel-bg)] border border-[color:var(--panel-border)] text-[var(--text-primary)] rounded-lg hover:bg-[color-mix(in_lab,var(--panel-border),var(--panel-bg))] transition-colors font-medium shadow-sm"
                  >
                    <Upload size={18} />
                    Load JSON
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default FormPreview;
