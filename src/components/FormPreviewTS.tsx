import React from "react";
import "./FormPreview.css";

type FormPreviewProps = {
  elements: {
    type: string;
    props: {
      name: string;
      placeholder: string;
      options?: { label: string; value: string }[];
    };
  }[];
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const FormPreview: React.FC<FormPreviewProps> = ({
  elements,
  handleSubmit,
}) => {
  // remaining code...
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
                <input {...element.props} />
              </>
            )}
            {element.type === "textarea" && (
              <>
                <label htmlFor={element.props.name}>
                  {element.props.name}:{" "}
                </label>
                <textarea {...element.props} />
              </>
            )}
            {element.type === "select" && (
              <>
                <label htmlFor={element.props.name}>
                  {element.props.name}:{" "}
                </label>
                <select {...element.props}>
                  {element.props.options?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
