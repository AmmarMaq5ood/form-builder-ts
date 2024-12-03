import { useState, FormEvent } from "react";
import FormAddElements from "../FormAddElements/FormAddElements";
import DraggableFormElements from "../FormElements/FormElements";
import FormPreview from "../FormPreview/FormPreview";

import { DndContext } from "@dnd-kit/core";

import "./FormBuilder.css";

type FormElementProps = {
  name: string;
  placeholder?: string;
  input_type?: string;
  options?: { label: string; value: string }[];
};

type FormElement = {
  type: string;
  props: FormElementProps;
};

const FormBuilderTS = () => {
  const [elements, setElements] = useState<FormElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>("");

  const handleAddElement = () => {
    let newProps: FormElementProps;
    if (["select", "radio", "checkbox"].includes(selectedElement)) {
      newProps = {
        name: "",
        options: [],
      };
    } else if (selectedElement === "input") {
      newProps = {
        name: "",
        placeholder: "",
        input_type: "",
      };
    } else if (["color", "datetime-local"].includes(selectedElement)) {
      newProps = {
        name: "",
      };
    } else {
      newProps = {
        name: "",
        placeholder: "",
      };
    }
    const newElement: FormElement = { type: selectedElement, props: newProps };
    setElements([...elements, newElement]);
  };

  const handlePropsChange = (index: number, newProps: FormElementProps) => {
    const newElements = [...elements];
    newElements[index].props = newProps;
    setElements(newElements);
  };

  const handleRemoveElement = (index: number) => {
    const newElements = [...elements];
    newElements.splice(index, 1);
    setElements(newElements);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const handleRemoveOption = (elementIndex: number, optionIndex: number) => {
    const newElements = [...elements];
    const options = newElements[elementIndex].props.options;
    if (options) {
      options.splice(optionIndex, 1);
      handlePropsChange(elementIndex, {
        ...newElements[elementIndex].props,
        options: options,
      });
    }
  };

  const handleMoveElement = (dragIndex: number, hoverIndex: number) => {
    const dragElement = elements[dragIndex];
    const newElements = [...elements];
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, dragElement);
    setElements(newElements);
  };

  const updateElements = (newElements: FormElement[]) => {
    setElements(newElements);
  };

  return (
    <DndContext> {/* Replaced DndProvider */}
      <div className="formbuilder__container">
        <div className="formbuilder__header">
          <h1>Form Builder</h1>
          <p>Save and Load Your Forms Anytime!</p>
        </div>
        <div className="formbuilder__body">
          <div className="formbuilder__form-elements">
            <h2 className="formbuilder_form-elements_heading">
              Add Your Form Elements Here!
            </h2>
            <FormAddElements
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              handleAddElement={handleAddElement}
            />
            <DraggableFormElements
              elements={elements}
              handlePropsChange={handlePropsChange}
              handleRemoveElement={handleRemoveElement}
              handleRemoveOption={handleRemoveOption}
              handleMoveElement={handleMoveElement}
            />
          </div>
          <div className="formbuilder__preview">
            <h2 className="formbuilder_preview_heading">Preview</h2>
            <FormPreview
              elements={elements}
              handleSubmit={handleSubmit}
              updateElements={updateElements}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default FormBuilderTS;