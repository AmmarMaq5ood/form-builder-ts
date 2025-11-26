import { useState, type FormEvent } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import FormAddElements from "../FormAddElements/FormAddElements";
import FormElements from "../FormElements/FormElements";
import FormPreview from "../FormPreview/FormPreview";

export type FormElementProps = {
  name: string;
  placeholder?: string;
  input_type?: string;
  options?: { label: string; value: string }[];
};

export type FormElement = {
  id: string;
  type: string;
  props: FormElementProps;
};

const FormBuilder = () => {
  const [elements, setElements] = useState<FormElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        input_type: "text",
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

    const newElement: FormElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: selectedElement,
      props: newProps,
    };
    setElements([...elements, newElement]);
  };

  const handlePropsChange = (id: string, newProps: FormElementProps) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, props: newProps } : el))
    );
  };

  const handleRemoveElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("Form Submitted", elements);
    alert("Form Submitted! Check console for data.");
  };

  const handleRemoveOption = (elementId: string, optionIndex: number) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id === elementId && el.props.options) {
          const newOptions = [...el.props.options];
          newOptions.splice(optionIndex, 1);
          return { ...el, props: { ...el.props, options: newOptions } };
        }
        return el;
      })
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateElements = (newElements: FormElement[]) => {
    setElements(newElements);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Builder Section */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Builder</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Configure your form elements</p>
        </div>

        <div className="mb-8">
          <FormAddElements
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            handleAddElement={handleAddElement}
          />
        </div>

        <div className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={elements.map((el) => el.id)}
              strategy={verticalListSortingStrategy}
            >
              {elements.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400">
                  No elements added yet. Start by adding one above!
                </div>
              ) : (
                elements.map((element) => (
                  <FormElements
                    key={element.id}
                    element={element}
                    handlePropsChange={handlePropsChange}
                    handleRemoveElement={handleRemoveElement}
                    handleRemoveOption={handleRemoveOption}
                  />
                ))
              )}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-8 h-fit">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Preview</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">See how your form looks</p>
        </div>
        <FormPreview
          elements={elements}
          handleSubmit={handleSubmit}
          updateElements={updateElements}
        />
      </div>
    </div>
  );
};

export default FormBuilder;
