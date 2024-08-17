import { useState } from "react";
import { Id, Task } from "../Types";
import DeleteICon from "../icons/DeleteIcon";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}
const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function toggleEditMode() {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  }
  if (editMode) {
    return (
      <>
        {" "}
        <div className="bg-columnbg p-2.5 h-[100px] min-h-[70px] rounded-xl text-left flex items-center hover:ring-2 hover:ring-yellow-300 hover:ring-inset cursor-grab relative">
          <textarea
            className="h-[90%] w-full bg-transparent resize-none focus:outline-none rounded"
            autoFocus
            value={task.content}
            placeholder="Task Content"
            onBlur={toggleEditMode}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) toggleEditMode();
            }}
            onChange={(e) => updateTask(task.id, e.target.value)}
          ></textarea>
        </div>
      </>
    );
  }
  return (
    <>
      <div
        onClick={toggleEditMode}
        className="bg-columnbg p-2.5 h-[100px] min-h-[70px] rounded-xl text-left flex items-center hover:ring-2 hover:ring-yellow-300 hover:ring-inset cursor-grab relative task"
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
      >
        <p className="my-auto h-[90%] w-full whitespace-pre-wrap overflow-x-clip  overflow-y-auto">
          {task.content}
        </p>
        {mouseIsOver && (
          <button
            className="stroke-gray-500 hover:stroke-red-300 absolute right-4 opacity-60 hover:opacity-100"
            onClick={() => deleteTask(task.id)}
          >
            <DeleteICon />
          </button>
        )}
      </div>
    </>
  );
};

export default TaskCard;
