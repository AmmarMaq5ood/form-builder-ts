import React, { useState } from "react";
import "./FormPreview.css";
import { Input, InputProps, Textarea } from "@cloudscape-design/components";

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
};

const FormPreview: React.FC<FormPreviewProps> = ({
  elements,
  handleSubmit,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  return (
    <div className="form-preview">
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
                  value={inputValue}
                  onChange={({ detail }) => setInputValue(detail.value)}
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
                  value={textareaValue}
                  onChange={({ detail }) => setTextareaValue(detail.value)}
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
                <select {...element.props}>
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
                  style={{ fontWeight: "bolder" }}
                  htmlFor={element.props.name}
                >
                  {element.props.name}:{" "}
                </label>
                {element.props.options?.map((option, index) => (
                  <label key={index}>
                    <div>
                      <input
                        style={{ fontWeight: 100 }}
                        type="radio"
                        name={element.props.name}
                        value={option.value}
                      />
                      {option.label}
                    </div>
                  </label>
                ))}
              </>
            )}
          </div>
        ))}
        {elements.length ? (
          <button type="submit">Submit</button>
        ) : (
          <p> Add elements to see the preview...</p>
        )}
      </form>
    </div>
  );
};

export default FormPreview;
