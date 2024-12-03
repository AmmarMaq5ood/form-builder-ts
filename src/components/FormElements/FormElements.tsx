import React, { useState } from "react";
import "./FormElements.css";
import { Input } from "@cloudscape-design/components";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FormElement {
  type: string;
  props: {
    name: string;
    placeholder?: string;
    input_type?: string;
    options?: { label: string; value: string }[];
  };
}

type FormElementsProps = {
  element: FormElement;
  index: number;
  handlePropsChange: (index: number, newProps: any) => void;
  handleRemoveElement: (index: number) => void;
  handleRemoveOption: (elementIndex: number, optionIndex: number) => void;
};

const SortableFormElement: React.FC<FormElementsProps & { id: string}> = ({
  element,
  index,
  id,
  handlePropsChange,
  handleRemoveElement,
  handleRemoveOption,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <FormElementContent
        element={element}
        index={index}
        handlePropsChange={handlePropsChange}
        handleRemoveElement={handleRemoveElement}
        handleRemoveOption={handleRemoveOption}
      />
    </div>
  );
};

const FormElementContent: React.FC<FormElementsProps> = ({
  element,
  index,
  handlePropsChange,
  handleRemoveElement,
  handleRemoveOption,
}) => {
  return (
    <div key={index} className="form_element_field_heading">
      {element.type === "input" ? (
        <h3>Input</h3>
      ) : element.type === "textarea" ? (
        <h3>Textarea</h3>
      ) : element.type === "select" ? (
        <h3>Select</h3>
      ) : element.type === "radio" ? (
        <h3>Radio</h3>
      ) : element.type === "checkbox" ? (
        <h3>CheckBox</h3>
      ) : element.type === "datetime-local" ? (
        <h3>Datetime</h3>
      ) : element.type === "color" ? (
        <h3>Color Picker</h3>
      ) : null}
      <div key={index} className="form_element_card">
        <button
          onClick={() => handleRemoveElement(index)}
          className="form_element_close"
        >
          x
        </button>
        <label className="form_element_label">
          Name:
          <Input
            type="text"
            value={element.props.name}
            onChange={({ detail }) =>
              handlePropsChange(index, {
                ...element.props,
                name: detail.value,
              })
            }
          />
        </label>
        {element.props.options ||
        element.type === "datetime-local" ||
        element.type === "color" ? null : (
          <label className="form_element_label">
            Placeholder:
            <Input
              type="text"
              value={element.props?.placeholder!}
              onChange={({ detail }) =>
                handlePropsChange(index, {
                  ...element.props,
                  placeholder: detail.value,
                })
              }
            />
          </label>
        )}

        {element.type === "input" && (
          <label className="form_element_label">
            Input Type:
            <select
              className="form_element_input_type"
              value={element.props.input_type}
              onChange={(e) =>
                handlePropsChange(index, {
                  ...element.props,
                  input_type: e.target.value,
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
        {element.type === "select" || element.type === "radio" ? (
          <div>
            {element.props.options?.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label className="form_element_label">
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
                <label className="form_element_label">
                  Value:
                  <input
                    className="csd-input"
                    type="text"
                    value={option.value}
                    placeholder="Required & Unique"
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
                    className="form_element_remove_option"
                    onClick={() => handleRemoveOption(index, optionIndex)}
                  >
                    Remove
                  </button>
                </label>
              </div>
            ))}
            <button
              className="form_element_add_option"
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
              Add Option +1
            </button>
          </div>
        ) : null}
        {element.type === "checkbox" && (
          <div>
            {element.props.options?.map((option, optionIndex) => (
              <div key={optionIndex}>
                <label className="form_element_label">
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
                <label className="form_element_label">
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
                    className="form_element_remove_option"
                    onClick={() => handleRemoveOption(index, optionIndex)}
                  >
                    Remove
                  </button>
                </label>
              </div>
            ))}
            <button
              className="form_element_add_option"
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

const DraggableFormElements: React.FC<{
  elements: FormElement[];
  handlePropsChange: (index: number, newProps: any) => void;
  handleRemoveElement: (index: number) => void;
  handleRemoveOption: (elementIndex: number, optionIndex: number) => void;
  handleMoveElement: (dragIndex: number, hoverIndex: number) => void;
}> = ({
  elements,
  handlePropsChange,
  handleRemoveElement,
  handleRemoveOption,
  handleMoveElement,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = elements.findIndex((el, idx) => `form-element-${idx}` === active.id);
      const newIndex = elements.findIndex((el, idx) => `form-element-${idx}` === over?.id);

      handleMoveElement(oldIndex, newIndex);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={elements.map((_, idx) => `form-element-${idx}`)}
        strategy={verticalListSortingStrategy}
      >
        {elements.map((element, index) => (
          <SortableFormElement
            key={`form-element-${index}`}
            id={`form-element-${index}`}
            element={element}
            index={index}
            handlePropsChange={handlePropsChange}
            handleRemoveElement={handleRemoveElement}
            handleRemoveOption={handleRemoveOption}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DraggableFormElements;