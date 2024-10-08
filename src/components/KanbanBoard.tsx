import { useEffect, useRef, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../Types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import DeleteICon from "../icons/DeleteIcon";

const KanbanBoard = () => {
  const initialState = [
    {
      id: generateID(),
      title: `Work in progress⚠️ `,
    },
    {
      id: generateID(),
      title: `Completed✅`,
    },
    {
      id: generateID(),
      title: `To be Done📃`,
    },
  ];

  const [columns, setColumns] = useState<Column[]>(() => {
    const storedColumns = localStorage.getItem("kb-columns");
    return storedColumns ? JSON.parse(storedColumns) : initialState;
  });
  const columnsId = columns.map((col) => col.id);
  const [tasks, SetTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("kb-tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const boardElement = boardRef.current;
    if (boardElement) {
      const handleWheel = (event: WheelEvent) => {
        if (window.innerWidth > 600) {
          event.preventDefault();
          boardElement.scrollLeft += event.deltaY;
        }
      };

      boardElement.addEventListener("wheel", handleWheel);

      return () => {
        boardElement.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kb-columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("kb-tasks", JSON.stringify(tasks));
  }, [tasks]);
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
    const sure = confirm("Sure?");
    if (!sure) return;

    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    SetTasks(newTasks);
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
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
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
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    if (!isActiveTask) return;

    const isOverTask = over.data.current?.type === "Task";
    if (isActiveTask && isOverTask) {
      SetTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverColumn) {
      SetTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].columnId = overId;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
  const createTask = (columnId: Id) => {
    const tasksToAdd: Task = {
      id: generateID(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    SetTasks([tasksToAdd, ...tasks]);
  };

  function deleteTask(taskId: Id) {
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    SetTasks(filteredTasks);
  }
  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    SetTasks(newTasks);
  }

  function clearLocalStorage() {
    localStorage.removeItem("kb-columns");
    localStorage.removeItem("kb-tasks");
  }
  return (
    <div
      className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden md:px-[40px] px-[10px] py-[10px] scroll-smooth"
      ref={boardRef}
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
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
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="h-[60px] w-[300px] min-w-[200px] cursor-pointer rounded-lg bg-mainbg border-2 border-columnbg p-4 ring-yellow-400 hover:ring-1 flex gap-2 active:scale-95"
              onClick={AddColumn}
            >
              <PlusIcon />
              Add Column
            </button>
            <button
              className="h-[60px] w-[300px] min-w-[200px] cursor-pointer rounded-lg bg-mainbg border-2 border-columnbg p-4 ring-yellow-400 hover:ring-1 flex gap-2 active:scale-95 stroke-orange-600"
              onClick={clearLocalStorage}
            >
              <DeleteICon />
              Clear Storage
            </button>
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
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
