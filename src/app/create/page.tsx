"use client";
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";

export default function AddTestForm() {
  const user = useUser().user;
  const router = useRouter();
  const addTestMutation = useMutation(api.tests.addTest);
  const [formData, setFormData] = useState({
    actual: "",
    desc: "",
    developer: [],
    expected: "",
    notes: "",
    status: "",
    createdBy: "",
    createdByImageUrl: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Update formData with createdBy and createdByImageUrl
    const updatedFormData = {
      ...formData,
      createdBy: user ? user.fullName : "", // Assign user's full name
      createdByImageUrl: user ? user.imageUrl : "", // Assign user's image URL
    };

    try {
      await addTestMutation({
        ...updatedFormData,
        createdBy: updatedFormData.createdBy || "", // Assign an empty string if createdBy is null
      });
      router.push("/"); // After successful mutation, navigate to the home page
    } catch (error) {
      console.error("Error adding test:", error);
      // Handle error case appropriately
    }

    // Optionally, clear the form fields after submission
    setFormData({
      actual: "",
      desc: "",
      developer: [],
      expected: "",
      notes: "",
      status: "",
      createdBy: "",
      createdByImageUrl: "",
    });
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "developer") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((dev: any) => dev.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCancel = () => {
    router.push("/"); // Navigates back to the home page
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Add Test
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Fill in the details for the new test.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Input for 'actual' */}
            <div className="sm:col-span-4">
              <label
                htmlFor="actual"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Actual Result
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="actual"
                  id="actual"
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter actual result"
                />
              </div>
            </div>

            {/* Input for 'desc' */}
            <div className="sm:col-span-4">
              <label
                htmlFor="desc"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="desc"
                  id="desc"
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter test description"
                />
              </div>
            </div>

            {/* Input for 'developer' */}
            <div className="sm:col-span-4">
              <label
                htmlFor="developer"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Developer(s)
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="developer"
                  id="developer"
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter developer names separated by commas"
                />
              </div>
            </div>

            {/* Input for 'expected' */}
            <div className="sm:col-span-4">
              <label
                htmlFor="expected"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Expected Result
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="expected"
                  id="expected"
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter expected result"
                />
              </div>
            </div>

            {/* Input for 'notes' */}
            <div className="sm:col-span-4">
              <label
                htmlFor="notes"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Notes
              </label>
              <div className="mt-2">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Additional notes"
                />
              </div>
            </div>

            {/* Input for 'status' */}
            <div className="sm:col-span-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Status
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="status"
                  id="status"
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter test status"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Test
          </button>
        </div>
      </div>
    </form>
  );
}
