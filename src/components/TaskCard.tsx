import { Task } from "../Types";
import RemoveIcon from "../icons/RemoveIcon";

interface Props {
  task: Task;
}
const TaskCard = ({ task }: Props) => {
  return (
    <>
      <div className="bg-columnbg p-2.5 h-[100px] min-h-[70px] rounded-md text-left flex items-center hover:ring-2 hover:ring-yellow-300 hover:ring-inset cursor-grab relative">
        {task.content}
        <button className="stroke-red-400 absolute right-4">
          <RemoveIcon />
          {/* //change Icon */}
        </button>
      </div>
    </>
  );
};

export default TaskCard;
