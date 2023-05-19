import { useState, FormEvent } from "react";
import FormAddElements from "./FormAddElementsTS";
import FormElements from "./FormElementsTS";
import FormPreview from "./FormPreviewTS";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./FormBuilder.css";

type FormElementProps = {
  name: string;
  placeholder?: string;
  input_type: string;
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
    if (["select", "radio"].includes(selectedElement)) {
      newProps = {
        name: "",
        input_type: "",
        options: [],
      };
    } else {
      newProps = {
        name: "",
        placeholder: "",
        input_type: "", 
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
    const formData: { [key: string]: string } = {};
    elements.forEach((element) => {
      console.log(element);
      formData[element.props.name] = "";
    });
    localStorage.setItem("formData", JSON.stringify(formData));
    console.log(
      `Form submitted, formData Submitted is: ${JSON.stringify(formData)}`
    );
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="formbuilder__container">
        <div className="formbuilder__header">
          <h1
            style={{
              textAlign: "center",
              borderBottom: "3px solid black",
              marginBottom: 20,
            }}
          >
            Form Builder
          </h1>
        </div>
        <div className="formbuilder__body">
          <div className="formbuilder__form-elements">
            <FormAddElements
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              handleAddElement={handleAddElement}
            />
            {elements?.map((element, index) => (
              <FormElements
                key={index}
                element={element}
                index={index}
                handlePropsChange={handlePropsChange}
                handleRemoveElement={handleRemoveElement}
                handleRemoveOption={handleRemoveOption}
                handleMoveElement={handleMoveElement}
              />
            ))}
          </div>
          <div className="formbuilder__preview">
            <h2>Preview</h2>
            <FormPreview elements={elements} handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilderTS;
