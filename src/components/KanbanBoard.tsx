import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../Types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = columns.map((col) => col.id);
  const [tasks, SetTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  );

  const AddColumn = () => {
    const columnsToAdd: Column = {
      id: generateID(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnsToAdd]);
  };
  function generateID() {
    return Math.floor(Math.random() * 10001);
  }
  function deleteColumn(id: Id): void {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  function updateColumn(id: Id, title: string): void {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  }
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    const activeColId = active.id;
    const overColId = over.id;
    if (activeColId === overColId) return;
    setColumns((columns) => {
      const activeColIndex = columns.findIndex((col) => col.id === activeColId);
      const overColIndex = columns.findIndex((col) => col.id === overColId);
      return arrayMove(columns, activeColIndex, overColIndex);
    });
  }
  const createTask = (columnId: Id) => {
    const tasksToAdd: Task = {
      id: generateID(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    SetTasks([...tasks, tasksToAdd]);
  };
  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden md:px-[40px] px-[10px] py-[10px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="mx-auto flex  md:flex-row flex-col-reverse gap-2">
          <div className="flex md:flex-row flex-col gap-6">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  column={col}
                  deleteColumn={deleteColumn}
                  key={col.id}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="h-[60px] w-[200px] min-w-[200px] cursor-pointer rounded-lg bg-mainbg border-2 border-columnbg p-4 ring-yellow-400 hover:ring-1 flex gap-2 active:scale-95"
            onClick={AddColumn}
          >
            <PlusIcon />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
