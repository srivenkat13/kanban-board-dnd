import { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id } from "../Types";
import ColumnContainer from "./ColumnContainer";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  console.log(columns);
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

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden md:px-[40px] px-[10px] py-[10px]">
      <div className="mx-auto flex  md:flex-row flex-col-reverse gap-2">
        <div className="flex md:flex-row flex-col gap-6">
          {columns.map((col) => (
            <ColumnContainer column={col} deleteColumn={deleteColumn} key={col.id} />
          ))}
        </div>
        <button
          className="h-[60px] w-[200px] min-w-[200px] cursor-pointer rounded-lg bg-mainbg border-2 border-columnbg p-4 ring-yellow-400 hover:ring-1 flex gap-2 active:scale-95"
          onClick={AddColumn}
        >
          <PlusIcon />
          Add Column
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;
