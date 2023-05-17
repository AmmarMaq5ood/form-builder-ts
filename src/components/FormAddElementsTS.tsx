import React from "react";

import "./FormAddElements.css";

type FormAddElementsProps = {
  selectedElement: string;
  setSelectedElement: (val: string) => void;
  handleAddElement: () => void;
};

const FormAddElements: React.FC<FormAddElementsProps> = ({
  selectedElement,
  setSelectedElement,
  handleAddElement,
}) => {
  // remaining code...
  return (
    <div>
      <select
        className="csd-select"
        style={{ borderRadius: 20, padding: 10, marginRight: 5 }}
        value={selectedElement}
        onChange={(e) => {
          console.log(`Selected Element is: ${e.target.value}`);
          setSelectedElement(e.target.value);
        }}
      >
        <option value="">Select an element</option>
        <option value="input">Input</option>
        <option value="textarea">Textarea</option>
        <option value="select">Select</option>
      </select>
      {selectedElement === "" ? (
        <button disabled onClick={handleAddElement}>
          Add
        </button>
      ) : (
        <button onClick={handleAddElement}>Add</button>
      )}
    </div>
  );
};

export default FormAddElements;
