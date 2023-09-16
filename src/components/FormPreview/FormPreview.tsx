import React, { useState, useRef } from "react";
import {
  Input,
  InputProps,
  Textarea,
  Select,
  SelectProps,
  RadioGroup,
  Checkbox,
} from "@cloudscape-design/components";
import FileSaver from "file-saver";

import "./FormPreview.css";

type FormPreviewProps = {
  elements: {
    type: string;
    props: {
      name: string;
      placeholder?: string;
      input_type?: string;
      options?: { label: string; value: string }[];
    };
  }[];
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  updateElements: (newElements: any) => void;
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

  const saveForm = () => {
    const dataToSave = {
      elements: elements,
      inputValues: inputValues,
    };
    const blob = new Blob([JSON.stringify(dataToSave)], {
      type: "application/json;charset=utf-8",
    });

    let saveFormName = "";
    if (inputValues && inputValues.formName) {
      saveFormName = inputValues.formName.toString() + ".json";
    } else {
      saveFormName = "form.json";
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
          const parsedContent = JSON.parse(content.toString());
          updateElements(parsedContent.elements);
          setInputValues(parsedContent.inputValues);
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
    <div className="form_preview_container">
      <form onSubmit={handleSubmit}>
        {elements.map((element, index) => (
          <div key={index}>
            {element.type === "input" && (
              <>
                <label htmlFor={element.props.name}>
                  {element.props.name}:{" "}
                </label>
                <Input
                  name={element.props.name}
                  placeholder={element.props.placeholder}
                  type={(element.props.input_type as InputProps.Type) || "text"}
                  value={(inputValues[element.props.name] as string) || ""}
                  onChange={({ detail }) =>
                    handleInputChange(element.props.name, detail.value)
                  }
                />
              </>
            )}
            {element.type === "textarea" && (
              <>
                <label htmlFor={element.props.name}>
                  {element.props.name}:{" "}
                </label>
                <Textarea
                  name={element.props.name}
                  placeholder={element.props.placeholder}
                  value={(inputValues[element.props.name] as string) || ""}
                  onChange={({ detail }) =>
                    handleInputChange(element.props.name, detail.value)
                  }
                />
              </>
            )}
            {element.type === "select" && (
              <>
                <label htmlFor={element.props.name}>
                  {element.props.name}:{" "}
                </label>
                <Select
                  selectedOption={
                    element.props.options?.find(
                      (option) =>
                        option.value === inputValues[element.props.name]
                    ) || { label: "Select an Option" }
                  }
                  onChange={({ detail }) =>
                    detail.selectedOption.value
                      ? handleInputChange(
                          element.props.name,
                          detail.selectedOption.value
                        )
                      : undefined
                  }
                  options={element.props.options || []}
                  selectedAriaLabel="Selected"
                />
              </>
            )}
            {element.type === "radio" && (
              <>
                <label htmlFor={element.props.name}>
                  {element.props.name}:{" "}
                </label>
                <RadioGroup
                  onChange={({ detail }) =>
                    handleInputChange(element.props.name, detail.value)
                  }
                  value={
                    Array.isArray(inputValues[element.props.name])
                      ? ""
                      : (inputValues[element.props.name] as string) || ""
                  }
                  items={element.props.options || []}
                />
              </>
            )}
            {element.type === "checkbox" && (
              <>
                <label htmlFor={element.props.name}>
                  {element.props.name}:{" "}
                </label>
                <div>
                  {element.props.options?.map((option, index) => (
                    <div key={index}>
                      <label>
                        <Checkbox
                          onChange={(event) => {
                            const selectedValues =
                              inputValues[element.props.name] || [];
                            let updatedValues: string[];

                            if (event.detail.checked) {
                              updatedValues = [
                                ...(selectedValues as string[]),
                                option.value,
                              ];
                            } else {
                              updatedValues = (
                                selectedValues as string[]
                              ).filter((value) => value !== option.value);
                            }

                            handleInputChange(
                              element.props.name,
                              updatedValues
                            );
                          }}
                          checked={
                            Array.isArray(inputValues[element.props.name]) &&
                            (
                              inputValues[element.props.name] as string[]
                            ).includes(option.value)
                          }
                        >
                          {option.label}
                        </Checkbox>
                      </label>
                    </div>
                  ))}{" "}
                </div>
              </>
            )}
            {element.type === "datetime-local" && (
              <div>
                <label htmlFor={element.props.name}>
                  {element.props.name}:
                  <div>
                    <input
                      type="datetime-local"
                      name={element.props.name}
                      value={(inputValues[element.props.name] as string) || ""}
                      onChange={(event) =>
                        handleInputChange(
                          element.props.name,
                          event.target.value
                        )
                      }
                    />
                  </div>
                </label>
              </div>
            )}
            {element.type === "color" && (
              <div>
                <label htmlFor={element.props.name}>
                  {element.props?.name}:
                  <div>
                    <input
                      type="color"
                      name={element.props?.name}
                      value={(inputValues[element.props?.name] as string) || ""}
                      onChange={(event) =>
                        handleInputChange(
                          element.props.name,
                          event.target.value
                        )
                      }
                    />
                  </div>
                </label>
              </div>
            )}
          </div>
        ))}
        {elements.length ? (
          <>
            <label htmlFor="formName">Form Name:</label>{" "}
            <Input
              name="formName"
              value={(inputValues["formName"] as string) || ""}
              onChange={({ detail }) =>
                handleInputChange("formName", detail.value)
              }
            />
            <div className="form_preview_btn_container">
              <button className="form_preview_save_form_btn" onClick={saveForm}>
                Save to JSON
              </button>
              <input type="file" ref={fileInputRef} onChange={loadForm} />
              <button
                className="form_preview_load_form_btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Load Form
              </button>
            </div>
          </>
        ) : (
          <div className="form_preview_starter_state">
            <p> Add elements to see the preview...</p>
            <h3>Or</h3>
            <input type="file" ref={fileInputRef} onChange={loadForm} />
            <button
              className="form_preview_load_form_btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Load Form
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormPreview;
