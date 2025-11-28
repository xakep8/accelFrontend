import { useEffect, useState, useMemo } from "react";
import { authenticatedFetch } from "../../utils/auth";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

export type TaskStatus = "PENDING" | "COMPLETED" | "IN_PROGRESS";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
}

export default function TaskList() {
  const [list, setList] = useState<Task[]>([]);
  const [completed, setCompleted] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/todo`
      );
      if (response.ok) {
        const data = await response.json();
        setList(data);
        setCompleted(
          data.filter((task: Task) => task.status === "COMPLETED").length
        );
      } else {
        console.error("Failed to fetch tasks");
      }
    }
    fetchTasks();
  }, []);

  const filteredList = useMemo(() => {
    let filtered = list;

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const filterDate = new Date(dateFilter);
        return (
          taskDate.getFullYear() === filterDate.getFullYear() &&
          taskDate.getMonth() === filterDate.getMonth() &&
          taskDate.getDate() === filterDate.getDate()
        );
      });
    }

    // Apply search filter
    if (search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerSearch) ||
          (task.description &&
            task.description.toLowerCase().includes(lowerSearch))
      );
    }

    return filtered;
  }, [list, search, dateFilter]);

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
      if (task.status === "COMPLETED") {
        setCompleted((prev) => prev + 1);
      }
    } else {
      setList((prevList) => prevList.map((t) => (t.id === task.id ? task : t)));
      // Recalculate completed count
      const updatedList = list.map((t) => (t.id === task.id ? task : t));
      setCompleted(
        updatedList.filter((t) => t.status === "COMPLETED").length
      );
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleDateFilter = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // If clicking the same date, clear the filter
    if (dateFilter === dateString) {
      setDateFilter(null);
    } else {
      setDateFilter(dateString);
    }
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date();
  const currentDay = today.getDay();

  // Get Sunday of current week
  const getSundayOfWeek = () => {
    const date = new Date(today);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const sundayDate = getSundayOfWeek();

  // Generate dates for the week
  const weekDates = daysOfWeek.map((_, index) => {
    const date = new Date(sundayDate);
    date.setDate(sundayDate.getDate() + index);
    return date.getDate();
  });

  return (
    <div className="flex w-full h-full flex-col py-10">
      <div className="flex w-full flex-col items-center mb-10">
        <h1 className="text-3xl font-bold">Task List</h1>
        <div className="flex items-start justify-baseline w-full overflow-scroll px-2">
          <div className="flex gap-2 mt-6">
            {daysOfWeek.map((day, index) => {
              const cardDate = new Date(sundayDate);
              cardDate.setDate(sundayDate.getDate() + index);
              const cardDateString = cardDate.toISOString().split('T')[0];
              const isFiltered = dateFilter === cardDateString;
              
              return (
                <div
                  key={day}
                  onClick={() => handleDateFilter(cardDate)}
                  className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    isFiltered
                      ? "bg-green-500 text-white ring-4 ring-green-300"
                      : index === currentDay
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase">
                    {day.slice(0, 3)}
                  </span>
                  <span className="text-2xl font-bold mt-1">
                    {weekDates[index]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex mt-10 justify-between px-10">
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
      <div className="flex flex-col px-10">
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
            />
          </div>
        ))}
      </div>
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
