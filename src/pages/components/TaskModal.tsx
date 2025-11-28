import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { authenticatedFetch } from "../../utils/auth";
import type { Task, TaskStatus } from "./TaskList";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (task: Task) => void;
  task?: Task | null;
  mode: "create" | "edit";
}

export default function TaskModal({
  isOpen,
  onClose,
  onSuccess,
  task,
  mode,
}: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PENDING" as TaskStatus,
  });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    dueDate?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize form when task changes or modal opens
  useEffect(() => {
    if (task && mode === "edit") {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
      });
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    } else {
      setFormData({
        title: "",
        description: "",
        status: "PENDING",
      });
      setDueDate(null);
    }
    setErrors({});
  }, [task, mode, isOpen]);

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const url =
        mode === "edit"
          ? `${import.meta.env.VITE_API_URL}/todo/${task?.id}`
          : `${import.meta.env.VITE_API_URL}/todo`;

      const response = await authenticatedFetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dueDate: dueDate ? dueDate.toISOString() : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({ title: error.message || "Operation failed" });
        return;
      }

      const data = await response.json();
      onSuccess(data);
      onClose();
    } catch (error) {
      setErrors({ title: "Network error. Please try again." });
      console.error("Task operation error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold text-gray-900"
                  >
                    {mode === "edit" ? "Edit Task" : "Create New Task"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-lg p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    onClick={handleClose}
                    disabled={submitting}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className={`block w-full rounded-lg border ${
                        errors.title ? "border-red-300" : "border-gray-300"
                      } px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                      placeholder="Enter task title"
                      disabled={submitting}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      placeholder="Enter task description (optional)"
                      disabled={submitting}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as TaskStatus,
                        })
                      }
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      disabled={submitting}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="dueDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Due Date
                    </label>
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => setDueDate(date)}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Select a due date"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                      disabled={submitting}
                      isClearable
                      minDate={new Date()}
                      showPopperArrow={false}
                      onChangeRaw={(e) => e?.preventDefault()}
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dueDate}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting
                        ? "Saving..."
                        : mode === "edit"
                        ? "Update Task"
                        : "Create Task"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
