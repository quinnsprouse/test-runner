"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import TestTable from "@/components/TestTable";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchString, setSearchString] = useState(""); // State for the search string
  const tests = searchString
    ? useQuery(api.tests.searchTests, { searchString: searchString }) // Pass an object with searchString
    : useQuery(api.tests.get);

  return (
    <>
      <TestTable tests={tests} />
    </>
  );
}
