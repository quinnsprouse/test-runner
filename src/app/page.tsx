"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import TestTable from "@/components/TestTable";
import { useSearch } from "@/utilities/SearchContext";

export default function Dashboard() {
  // Accept searchString as a prop
  const { searchString } = useSearch();
  let tests = searchString
    ? useQuery(api.tests.searchTests, { searchString: searchString })
    : useQuery(api.tests.get);

  return (
    <>
      <TestTable tests={tests} />
    </>
  );
}
