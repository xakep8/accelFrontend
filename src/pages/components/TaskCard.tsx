import type { Task } from "./TaskList";
import StatusDrop from "./TaskDropDown";
import { authenticatedFetch } from "../../utils/auth";
import { type TaskStatus } from "./TaskList";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/20/solid";

export default function TaskCard({
  task,
  setList,
  setCompleted,
  onEdit,
  setFilteredList,
}: {
  task: Task;
  setList: React.Dispatch<React.SetStateAction<Task[]>>;
  setCompleted: React.Dispatch<React.SetStateAction<number>>;
  onEdit?: (task: Task) => void;
  setFilteredList: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    // Persist the change to the API
    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/todo/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        console.error("Failed to update task status");
      } else {
        setList((prevList) =>
          prevList.map((t) =>
            t.id === taskId ? { ...t, status: newStatus as TaskStatus } : t
          )
        );
        setFilteredList((prevList) =>
          prevList.map((t) =>
            t.id === taskId ? { ...t, status: newStatus as TaskStatus } : t
          )
        );
        setCompleted((prevCompleted) =>
          newStatus === "COMPLETED"
            ? prevCompleted + 1
            : task.status === "COMPLETED"
            ? prevCompleted - 1
            : prevCompleted
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/todo/${taskId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        console.error("Failed to delete task");
      } else {
        setList((prevList) => prevList.filter((t) => t.id !== taskId));
        setFilteredList((prevList) => prevList.filter((t) => t.id !== taskId));
        if (task.status === "COMPLETED") {
          setCompleted((prevCompleted) => prevCompleted - 1);
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  return (
    <div className="relative flex lg:flex-row flex-col w-full px-5 lg:px-20 py-10 bg-cyan-400 rounded-2xl">
      <button
        className="absolute bg-transparent px-1 py-1 right-14 top-5 hover:bg-cyan-500 rounded-lg transition-colors"
        onClick={handleEdit}
      >
        <PencilSquareIcon className="h-6 w-6" />
      </button>
      <button
        className="absolute bg-transparent px-1 py-1 right-5 top-5 hover:bg-cyan-500 rounded-lg transition-colors"
        onClick={() => handleDelete(task.id)}
      >
        <TrashIcon className="h-6 w-6" />
      </button>
      <div className="flex w-full flex-col text-left lg:justify-between">
        <div className="flex w-full lg:flex-row flex-col items-center mb-5">
          <p>Title:</p>
          <p className="text-xl font-semibold">{task.title}</p>
        </div>
        {task.description && (
          <div className="flex w-full lg:flex-row flex-col items-center mb-5">
            <p>Description:</p>
            <p className="text-xl font-semibold">{task.description}</p>
          </div>
        )}
      </div>
      <div className="flex w-full lg:flex-row flex-col lg:justify-end justify-center items-center mb-5">
        <p>Due Date:</p>
        <p className="text-xl font-semibold">
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>
      <div className="flex w-full lg:justify-end justify-center lg:flex-row flex-col items-center mb-5">
        <p>Status:</p>
        <StatusDrop
          Status={task.status}
          onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
        />
      </div>
    </div>
  );
}
