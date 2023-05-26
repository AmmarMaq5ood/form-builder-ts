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
  return (
    <div>
      <select
        className="add_elements_select"
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
        <option value="radio">Radio</option>
        <option value="checkbox">Checkbox</option>
      </select>
      {selectedElement === "" ? (
        <button className="add_elements_btn" disabled onClick={handleAddElement}>
          Add
        </button>
      ) : (
        <button className="add_elements_btn" onClick={handleAddElement}>Add</button>
      )}
    </div>
  );
};

export default FormAddElements;
