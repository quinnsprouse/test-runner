"use client";
import React from "react";
import AddTestForm from "../../create/page";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Spinner from "@/components/spinner";

export default function EditTest({ params }: { params: { id: Id<"tests"> } }) {
  const testId = params.id;
  const test = useQuery(api.tests.getTestById, { testId });

  if (!test) {
    return <Spinner />;
  }

  return (
    <>
      <AddTestForm editMode={true} testData={test} />
    </>
  );
}
