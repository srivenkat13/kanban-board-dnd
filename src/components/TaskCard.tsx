import { useState } from "react";
import { Id, Task } from "../Types";
import DeleteICon from "../icons/DeleteIcon";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
}
const TaskCard = ({ task, deleteTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  return (
    <>
      <div
        className="bg-columnbg p-2.5 h-[100px] min-h-[70px] rounded-md text-left flex items-center hover:ring-2 hover:ring-yellow-300 hover:ring-inset cursor-grab relative"
        onMouseEnter={() => {
          setMouseIsOver(true);
        }}
        onMouseLeave={() => {
          setMouseIsOver(false);
        }}
      >
        {task.content}
        {mouseIsOver && (
          <button
            className="stroke-gray-500 hover:stroke-red-300 absolute right-4 opacity-60 hover:opacity-100"
            onClick={() => deleteTask(task.id)}
          >
            <DeleteICon />
            {/* //change Icon */}
          </button>
        )}
      </div>
    </>
  );
};

export default TaskCard;
