import React from "react";
import "./FormElements.css";

type FormElementsProps = {
  element: {
    type: string;
    props: {
      name: string;
      placeholder: string;
      inputType: string;
      options?: { label: string; value: string }[];
    };
  };
  index: number;
  handlePropsChange: (index: number, newProps: any) => void;
  handleRemoveElement: (index: number) => void;
  handleRemoveOption: (elementIndex: number, optionIndex: number) => void;
};

const FormElements: React.FC<FormElementsProps> = ({
  element,
  index,
  handlePropsChange,
  handleRemoveElement,
  handleRemoveOption,
}) => {
  return (
    <div key={index}>
      {element.type === "input" ? (
        <h3>Input</h3>
      ) : element.type === "textarea" ? (
        <h3>Textarea</h3>
      ) : element.type === "select" ? (
        <h3>Select</h3>
      ) : null}
      <div
        key={index}
        style={{
          flex: 1,
          width: "100%",
          border: "1px solid whitesmoke",
          backgroundColor: "whitesmoke",
          borderRadius: 5,
          padding: 20,
          marginBottom: 20,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={() => handleRemoveElement(index)}
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            borderRadius: 100,
            padding: 3,
            cursor: "pointer",
          }}
        >
          ❌
        </button>
        <label style={{ fontWeight: "bolder" }}>
          Name:{" "}
          <input
            className="csd-input"
            type="text"
            value={element.props.name}
            onChange={(e) =>
              handlePropsChange(index, {
                ...element.props,
                name: e.target.value,
              })
            }
          />
        </label>
        <label style={{ fontWeight: "bolder" }}>
          Placeholder:
          <input
            className="csd-input"
            type="text"
            value={element.props.placeholder}
            onChange={(e) =>
              handlePropsChange(index, {
                ...element.props,
                placeholder: e.target.value,
              })
            }
          />
        </label>
        {element.type === "input" && (
          <label style={{ fontWeight: "bolder" }}>
            Input Type:
            <select
              style={{ borderRadius: 20, padding: 5, marginLeft: 5 }}
              value={element.props.inputType}
              onChange={(e) =>
                handlePropsChange(index, {
                  ...element.props,
                  inputType: e.target.value,
                })
              }
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
            </select>
          </label>
        )}
        {element.type === "select" && (
          <div>
            {element.props.options?.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label>
                  Label:
                  <input
                    className="csd-input"
                    type="text"
                    value={option.label}
                    onChange={(e) => {
                      const newOptions = [...element.props.options!];
                      newOptions[optionIndex] = {
                        ...option,
                        label: e.target.value,
                      };
                      handlePropsChange(index, {
                        ...element.props,
                        options: newOptions,
                      });
                    }}
                  />
                </label>
                <label>
                  Value:
                  <input
                    className="csd-input"
                    type="text"
                    value={option.value}
                    onChange={(e) => {
                      const newOptions = [...element.props.options!];
                      newOptions[optionIndex] = {
                        ...option,
                        value: e.target.value,
                      };
                      handlePropsChange(index, {
                        ...element.props,
                        options: newOptions,
                      });
                    }}
                  />
                  <button
                    onClick={() => handleRemoveOption(index, optionIndex)}
                  >
                    Remove
                  </button>
                </label>
              </div>
            ))}
            <button
              onClick={() =>
                handlePropsChange(index, {
                  ...element.props,
                  options: [
                    ...element.props.options!,
                    { label: "", value: "" },
                  ],
                })
              }
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormElements;
