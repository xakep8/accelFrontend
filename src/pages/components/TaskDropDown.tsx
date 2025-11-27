import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function StatusDrop(props: {
  Status: string;
  onStatusChange: (newStatus: string) => void;
}) {
  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-5 py-3 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:border-blue-600 border-2 border-transparent bg-gray-900">
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 size-5 text-gray-400"
        />
        {props.Status}
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <button
              onClick={() => props.onStatusChange("PENDING")}
              className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
            >
              Pending
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => props.onStatusChange("IN_PROGRESS")}
              className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
            >
              In Progress
            </button>
          </MenuItem>
          <MenuItem>
            <button
              onClick={() => props.onStatusChange("COMPLETED")}
              className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
            >
              Completed
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
