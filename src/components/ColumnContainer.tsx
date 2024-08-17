import { useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../Types";
import RemoveIcon from "../icons/RemoveIcon";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  tasks: Task[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}
const ColumnContainer = (props: Props) => {
  const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask,updateTask } =
    props;
  const [editMode, setEditMode] = useState(false);
  const [isScaled, setIsScaled] = useState(false);
  const {
    setNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  useEffect(() => {
    setIsScaled(true);
    const timeout = setTimeout(() => {
      setIsScaled(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [tasks.length]);
  const scaleStyle = {
    transform: isScaled ? "scale(1.2)" : "scale(1)",
    color: isScaled ? "#dc2626 " : "#fde047",
    transition: "transform 0.5s , color 0.5s",
  };
  if (isDragging) {
    return (
      <div
        // ref={setNodeRef}
        style={style}
        className=" bg-columnbg rounded-md  opacity-[0.7] border-2 border-yellow-300 w-[300px]  h-[400px] md:h-[500px]  max-h-[500px] flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" bg-mainbg rounded-md  w-[300px]  h-[400px] md:h-[500px]  max-h-[500px] flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-gray-900 h-[50px] cursor-grab rounded-md rounded-b-none border-4 border-columnbg p-3 font-bold flex justify-between items-center "
      >
        <div className="flex gap-2">
          <div
            className="text-yellow-300 rounded-lg bg-gray-800 py-1 px-2 flex  justify-center items-center"
            style={scaleStyle}
          >
            {tasks.length}
          </div>
          {!editMode && <div> {column.title}</div>}
          {editMode && (
            <input
              autoFocus
              value={column.title}
              onChange={(e) => {
                updateColumn(column.id, e.target.value);
              }}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              className=" bg-slate-700 border focus:border-yellow-300 rounded-md outline-none px-1"
            />
          )}
        </div>

        <button
          className="stroke-yellow-300 hover:stroke-red-400"
          onClick={() => deleteColumn(column.id)}
        >
          <RemoveIcon />
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4   p-2 overflow-x-hidden overflow-y-auto">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        ))}
      </div>
      <button
        className="flex gap-2 items-center  border-columnbg border-2 p-4 rounded-lg hover:text-yellow-300 active:bg-black "
        onClick={() => createTask(column.id)}
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
};

export default ColumnContainer;
