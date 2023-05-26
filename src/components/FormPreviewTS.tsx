import React, { useState, useRef } from "react";
import { Input, InputProps, Textarea } from "@cloudscape-design/components";
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
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = fileReader.result;
      if (content) {
        const parsedContent = JSON.parse(content.toString());
        updateElements(parsedContent.elements);
        setInputValues(parsedContent.inputValues);
      }
    };
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0]);
    }
  };

  const handleInputChange = (name: string, value: string | string[]) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    name: string
  ) => {
    const value = event.target.value;
    handleInputChange(name, value);
  };

  const handleRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const value = event.target.value;
    handleInputChange(name, value);
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
                <div>
                  <label htmlFor={element.props.name}>
                    {element.props.name}:{" "}
                  </label>
                </div>
                <select
                  className="form_preview_select"
                  value={inputValues[element.props.name] || ""}
                  onChange={(event) =>
                    handleSelectChange(event, element.props.name)
                  }
                >
                  {element.props.options?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </>
            )}
            {element.type === "radio" && (
              <>
                <label
                  htmlFor={element.props.name}
                >
                  {element.props.name}:{" "}
                </label>
                {element.props.options?.map((option, index) => (
                  <label key={index}>
                    <div>
                      <input
                        type="radio"
                        name={element.props.name}
                        value={option.value}
                        checked={
                          inputValues[element.props.name] === option.value
                        }
                        onChange={(event) =>
                          handleRadioChange(event, element.props.name)
                        }
                      />
                      {option.label}
                    </div>
                  </label>
                ))}
              </>
            )}
            {element.type === "checkbox" && (
              <>
                <label
                  htmlFor={element.props.name}
                >
                  {element.props.name}:{" "}
                </label>
                <div>
                  {element.props.options?.map((option, index) => (
                    <div key={index}>
                      <label>
                        <input
                          type="checkbox"
                          name={element.props.name}
                          value={option.value}
                          checked={
                            Array.isArray(inputValues[element.props.name]) &&
                            (
                              inputValues[element.props.name] as string[]
                            ).includes(option.value)
                          }
                          onChange={(event) => {
                            const selectedValues =
                              inputValues[element.props.name] || [];
                            const checkedValue = event.target.value;
                            let updatedValues: string[];

                            if (event.target.checked) {
                              updatedValues = [
                                ...(selectedValues as string[]),
                                checkedValue,
                              ];
                            } else {
                              updatedValues = (
                                selectedValues as string[]
                              ).filter((value) => value !== checkedValue);
                            }

                            handleInputChange(
                              element.props.name,
                              updatedValues
                            );
                          }}
                        />
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </>
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
              <button onClick={saveForm}>Save to JSON</button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={loadForm}
              />
              <button onClick={() => fileInputRef.current?.click()}>
                Load Form
              </button>
            </div>
          </>
        ) : (
          <div className="form_preview_starter_state">
            <p> Add elements to see the preview...</p>
            <h3>Or</h3>
            <input
              type="file"
              ref={fileInputRef}
              onChange={loadForm}
            />
            <button onClick={() => fileInputRef.current?.click()}>
              Load Form
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormPreview;
