import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Status options with associated icons
const statusOptions = [
  {
    id: 1,
    name: "Pass",
    color: "bg-green-100 text-green-700",
    Icon: CheckIcon,
  },
  { id: 2, name: "Fail", color: "bg-red-100 text-red-700", Icon: XCircleIcon },
  {
    id: 3,
    name: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    Icon: ClockIcon,
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function StatusDropdown({
  onStatusChange,
}: {
  onStatusChange: (name: string) => void;
}) {
  const [selected, setSelected] = useState(statusOptions[0]);

  useEffect(() => {
    onStatusChange(selected.name);
  }, [selected, onStatusChange]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
            Status
          </Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none sm:text-sm sm:leading-6">
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${selected.color}`}
              >
                {selected.name}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {statusOptions.map((status) => (
                  <Listbox.Option
                    key={status.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-gray-100 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={status}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                            status.color
                          )}
                        >
                          {status.name}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
