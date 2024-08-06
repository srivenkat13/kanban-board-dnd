import { Column, Id } from "../Types";
import RemoveIcon from "../icons/RemoveIcon";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}
const ColumnContainer = (props: Props) => {
  const { column, deleteColumn } = props;

  return (
    <div className=" bg-mainbg rounded-md  w-[300px]  h-[400px] md:h-[500px]  max-h-[500px] flex flex-col">
      <div className="bg-gray-900 h-[50px] cursor-grab rounded-md rounded-b-none border-4 border-columnbg p-3 font-bold flex justify-between items-center ">
        <div className="flex gap-2">
          <div className="text-yellow-300 rounded-lg bg-gray-800 py-1 px-2 flex  justify-center items-center">
            0
          </div>
          {column.title}
        </div>

        <button
          className="stroke-yellow-300 hover:stroke-red-400"
          onClick={() => deleteColumn(column.id)}
        >
          <RemoveIcon />
        </button>
      </div>
      <div className="flex flex-grow">Content</div>
      <div>footer</div>
    </div>
  );
};

export default ColumnContainer;
