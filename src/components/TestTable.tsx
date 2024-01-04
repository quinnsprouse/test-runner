import React, { Fragment, useEffect, useRef, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import { Menu, Transition } from "@headlessui/react";
import {
  CalendarDaysIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import TestEmptyState from "./TestEmptyState";
import { getStatusClassName } from "@/utilities/utils";

type TestItem = {
  _id: Id<"tests">;
  _creationTime: number;
  actual: string;
  desc: string;
  developer: string[];
  expected: string;
  notes: string;
  status: string;
  createdBy: string;
  createdByImageUrl: string;
};

// Props for the TestTable component
type TestTableProps = {
  tests: TestItem[] | undefined;
};

const TestTable: React.FC<TestTableProps> = ({ tests }) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const deleteTestMutation = useMutation(api.tests.deleteTest);
  const updateTestStatusMutation = useMutation(api.tests.updateTestStatus);
  const [openMenuId, setOpenMenuId] = useState<Id<"tests"> | null>(null);
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      // Call the deleteTest mutation to delete the test
      await deleteTestMutation({ id: id as Id<"tests"> });
      // Optionally, you can perform any additional logic after deletion
      console.log("Delete:", id);
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const toggleStatus = async (id: Id<"tests">, newStatus: string) => {
    try {
      await updateTestStatusMutation({ id, status: newStatus });
      // Optionally refresh local state or re-fetch tests to update UI
    } catch (error) {
      console.error("Error updating test status:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null); // Close the menu
      }
    }

    // Add event listener when the menu is open
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Remove event listener when cleaning up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  if (tests === undefined) {
    return <Spinner />;
  } else if (tests.length === 0) {
    // Display the empty state when there are no tests
    return <TestEmptyState />;
  }

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Tests
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the tests that exist in the system
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => router.push("/create")}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Test
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created By
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Tags
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created On
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tests?.map((item, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={(e) => {
                      router.push(`/test/${item._id}`);
                    }}
                  >
                    <td className="px-3 py-5 text-sm text-gray-500">
                      {item.desc}
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500">
                      <dt className="text-sm font-semibold text-gray-900 flex items-center">
                        <img
                          className="h-6 w-6 rounded-full bg-gray-50"
                          src={item.createdByImageUrl}
                          alt=""
                        />
                        <span className="hidden lg:flex lg:items-center ml-4">
                          <span
                            className="text-sm font-semibold text-gray-900"
                            aria-hidden="true"
                          >
                            {item.createdBy}
                          </span>
                        </span>
                      </dt>
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusClassName(
                          item.status
                        )}`}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500">new tag</td>
                    <td className="px-3 py-5 text-sm">
                      <div className="flex">
                        <dd className="text-sm font-medium text-gray-900">
                          <time
                            dateTime={new Date(
                              item._creationTime
                            ).toISOString()}
                          >
                            {new Date(item._creationTime).toLocaleString()}
                          </time>
                        </dd>
                      </div>
                    </td>
                    <td className="text-sm text-gray-500">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button
                            className="flex items-center text-gray-400 hover:text-gray-600"
                            ref={menuButtonRef}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === item._id ? null : item._id
                              );
                            }}
                          >
                            <EllipsisVerticalIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          show={openMenuId === item._id}
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                            <div className="py-1">
                              {item.status !== "pass" && (
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleStatus(item._id, "pass");
                                      }}
                                      className={`${
                                        active ? "bg-green-100" : ""
                                      } w-full px-4 py-2 text-sm leading-5 text-left`}
                                    >
                                      Change to{" "}
                                      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                        Pass
                                      </span>
                                    </button>
                                  )}
                                </Menu.Item>
                              )}

                              {item.status !== "fail" && (
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleStatus(item._id, "fail");
                                      }}
                                      className={`${
                                        active ? "bg-red-100" : ""
                                      } w-full px-4 py-2 text-sm leading-5 text-left`}
                                    >
                                      Change to{" "}
                                      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-red-100 text-red-700">
                                        Fail
                                      </span>
                                    </button>
                                  )}
                                </Menu.Item>
                              )}

                              {item.status !== "pending" && (
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleStatus(item._id, "pending");
                                      }}
                                      className={`${
                                        active ? "bg-yellow-100" : ""
                                      } w-full px-4 py-2 text-sm leading-5 text-left`}
                                    >
                                      Change to{" "}
                                      <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700">
                                        Pending
                                      </span>
                                    </button>
                                  )}
                                </Menu.Item>
                              )}
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEdit(item._id);
                                    }}
                                    className={`${
                                      active ? "bg-gray-100" : ""
                                    } block px-4 py-2 text-sm text-gray-700`}
                                  >
                                    Edit
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(item._id);
                                    }}
                                    className={`${
                                      active ? "bg-gray-100" : ""
                                    } block px-4 py-2 text-sm text-gray-700`}
                                  >
                                    Delete
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTable;
