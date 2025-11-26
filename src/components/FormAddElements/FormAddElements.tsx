import React from "react";
import { PlusCircle } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Element Type
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
          value={selectedElement}
          onChange={(e) => {
            setSelectedElement(e.target.value);
          }}
        >
          <option value="">Choose an element...</option>
          <option value="input">Input Field</option>
          <option value="textarea">Text Area</option>
          <option value="select">Dropdown (Select)</option>
          <option value="radio">Radio Buttons</option>
          <option value="checkbox">Checkboxes</option>
          <option value="datetime-local">Date & Time</option>
          <option value="color">Color Picker</option>
        </select>
      </div>
      <button
        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${selectedElement === ""
            ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        disabled={selectedElement === ""}
        onClick={handleAddElement}
      >
        <PlusCircle size={20} />
        Add Element
      </button>
    </div>
  );
};

export default FormAddElements;
