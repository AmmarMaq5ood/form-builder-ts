import React, { useRef } from "react";
import "./FormElements.css";
import { XYCoord } from "dnd-core";
import {Input} from "@cloudscape-design/components"

import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";

interface Item {
  type: string;
  index: number;
}

type FormElementsProps = {
  element: {
    type: string;
    props: {
      name: string;
      placeholder?: string;
      input_type?: string;
      options?: { label: string; value: string }[];
    };
  };
  index: number;
  handlePropsChange: (index: number, newProps: any) => void;
  handleRemoveElement: (index: number) => void;
  handleRemoveOption: (elementIndex: number, optionIndex: number) => void;
  handleMoveElement: (dragIndex: number, hoverIndex: number) => void;
};

const FormElements: React.FC<FormElementsProps> = ({
  element,
  index,
  handlePropsChange,
  handleRemoveElement,
  handleRemoveOption,
  handleMoveElement,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "formElement",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<Item, any, any>({
    accept: "formElement",
    hover(item: { type: string; index: number }, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      handleMoveElement(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });
  drag(ref);
  return (
    <div
      ref={ref}
      key={index}
      style={{
        opacity: isDragging ? 0.1 : 1,
        transform: `translate(0px, ${isDragging ? "-20px" : "0px"})`,
        transition: "all 0.5s ease",
      }}
    >
      <div ref={drop}>
        <div key={index}>
          {element.type === "input" ? (
            <h3>Input</h3>
          ) : element.type === "textarea" ? (
            <h3>Textarea</h3>
          ) : element.type === "select" ? (
            <h3>Select</h3>
          ) : element.type === "radio" ? (
            <h3>Radio</h3>
          ) : null}
          <div key={index} className="form_element_card">
            <button
              onClick={() => handleRemoveElement(index)}
              className="form_element_close"
            >
              ❌
            </button>
            <label style={{ fontWeight: "bolder" }}>
              Name:{" "}
              <Input
                type="text"
                value={element.props.name}
                onChange={({detail}) =>
                  handlePropsChange(index, {
                    ...element.props,
                    name: detail.value,
                  })
                }
              />
            </label>
            {element.props.options ? null : (
              <label style={{ fontWeight: "bolder" }}>
                Placeholder:
                <Input
                  type="text"
                  value={element.props?.placeholder!}
                  onChange={({detail}) =>
                    handlePropsChange(index, {
                      ...element.props,
                      placeholder: detail.value,
                    })
                  }
                />
              </label>
            )}

            {element.type === "input" && (
              <label style={{ fontWeight: "bolder" }}>
                Input Type:
                <select
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormElements;
