import { useEffect, useState } from "react";
import { authenticatedFetch } from "../../utils/auth";
import TaskCard from "./taskCard";
import TaskModal from "./TaskModal";

export type TaskStatus = "PENDING" | "COMPLETED" | "IN_PROGRESS";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export default function TaskList() {
  const [list, setList] = useState<Task[]>([]);
  const [completed, setCompleted] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/todo`
      );
      if (response.ok) {
        const data = await response.json();
        setList(data);
        setFilteredList(data);
        setCompleted(
          data.filter((task: Task) => task.status === "COMPLETED").length
        );
      } else {
        console.error("Failed to fetch tasks");
      }
    }
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setModalMode("create");
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setModalMode("edit");
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSuccess = (task: Task) => {
    if (modalMode === "create") {
      setList((prevList) => [...prevList, task]);
      setFilteredList((prevList) => [...prevList, task]);
      if (task.status === "COMPLETED") {
        setCompleted((prev) => prev + 1);
      }
    } else {
      setList((prevList) => prevList.map((t) => (t.id === task.id ? task : t)));
      setFilteredList((prevList) =>
        prevList.map((t) => (t.id === task.id ? task : t))
      );
      // Recalculate completed count
      setCompleted(
        list.filter((t) =>
          t.id === task.id
            ? task.status === "COMPLETED"
            : t.status === "COMPLETED"
        ).length
      );
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim() === "") {
      setFilteredList(list);
    } else {
      const lowerSearch = value.toLowerCase();
      setFilteredList(
        list.filter(
          (task) =>
            task.title.toLowerCase().includes(lowerSearch) ||
            (task.description &&
              task.description.toLowerCase().includes(lowerSearch))
        )
      );
    }
  };

  return (
    <div className="flex w-full h-full px-10 flex-col py-10">
      <div className="flex w-full flex-col justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Task List</h1>
        <div className="flex mt-10 justify-between">
          <div className="px-5 py-3 bg-gray-500 rounded-2xl text-white">
            <p className="text-sm">
              Completed Tasks: {completed} / {list.length}
            </p>
          </div>
          <div className="px-5 py-3 bg-gray-500 rounded-2xl text-white ml-10">
            <p className="text-sm">
              Pending Tasks: {list.length - completed} / {list.length}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-col gap-5 mb-5 flex justify-between items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 mr-2"
          placeholder="Search tasks..."
        />
        <button
          className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl"
          onClick={handleAddTask}
        >
          Add New Task
        </button>
      </div>
      {filteredList.map((task, index) => (
        <div
          key={index}
          className="flex w-full justify-between items-center mb-5"
        >
          <TaskCard
            task={task}
            setList={setList}
            setCompleted={setCompleted}
            onEdit={handleEditTask}
            setFilteredList={setFilteredList}
          />
        </div>
      ))}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        task={editingTask}
        mode={modalMode}
      />
    </div>
  );
}
