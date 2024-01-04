"use client";
import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { Id } from "../../../convex/_generated/dataModel";
import StatusDropdown from "@/components/StatusSelect";

interface TestFormData {
  actual: string;
  desc: string;
  developer: string[];
  expected: string;
  notes: string;
  status: string;
  createdBy: string;
  createdByImageUrl: string;
}

interface testData {
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
}

interface AddTestFormProps {
  editMode?: boolean;
  testData?: testData;
}

const AddTestForm: React.FC<AddTestFormProps> = (props) => {
  const user = useUser().user;
  const router = useRouter();
  const addTestMutation = useMutation(api.tests.addTest);
  const editTestMutilation = useMutation(api.tests.editTestMutilation);
  const defaultFormData: TestFormData = {
    actual: "",
    desc: "",
    developer: [],
    expected: "",
    notes: "",
    status: "",
    createdBy: "",
    createdByImageUrl: "",
  };

  const [formData, setFormData] = useState<TestFormData>({
    ...defaultFormData,
    ...(props.testData ?? {}), // Use nullish coalescing operator (??) here
  });

  const pickAllowedFields = (data: any) => {
    const { _id, _creationTime, ...allowedFields } = data;
    return allowedFields;
  };

  const handleStatusChange = (newStatus: string) => {
    newStatus = newStatus.toLowerCase();
    setFormData({ ...formData, status: newStatus });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Update formData with createdBy and createdByImageUrl
    const updatedFormData = {
      ...formData,
      createdBy: user ? user.fullName : "", // Assign user's full name
      createdByImageUrl: user ? user.imageUrl : "", // Assign user's image URL
    };

    try {
      if (props.editMode && props.testData) {
        // Call the edit test mutation/API here
        const fieldsToUpdate = pickAllowedFields(updatedFormData);

        await editTestMutilation({
          testId: props.testData._id,
          updatedFields: fieldsToUpdate,
        });
        // Handle post-edit navigation or actions here
      } else {
        // This is the add new test scenario
        await addTestMutation({
          ...updatedFormData,
          createdBy: updatedFormData.createdBy || "", // Assign an empty string if createdBy is null
        });
        // Handle post-add navigation or actions here
      }

      router.push("/"); // Navigate to the desired page after successful add/edit
    } catch (error) {
      console.error("Error in form submission:", error);
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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
            {props.editMode ? "Edit Test" : "Add Test"}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {props.editMode
              ? "Modify the details of the test."
              : "Fill in the details for the new test."}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                  defaultValue={formData.desc}
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
                  // defaultValue={formData.developer.join(", ")}
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
                  defaultValue={formData.expected}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter expected result"
                />
              </div>
            </div>

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
                  defaultValue={formData.actual}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter actual result"
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
                  defaultValue={formData.notes}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Additional notes"
                />
              </div>
            </div>

            {/* Input for 'status' */}
            <div className="sm:col-span-4">
              <div className="w-1/2">
                <StatusDropdown onStatusChange={handleStatusChange} />
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
            {props.editMode ? "Update Test" : "Add Test"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTestForm;
