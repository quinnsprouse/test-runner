import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...
  activities: defineTable({
    id: v.number(),
    testId: v.id("tests"), // Foreign key to the 'tests' table
    type: v.string(),
    person: v.object({
      name: v.string(),
      imageUrl: v.optional(v.string()), // Optional because not all activities have an imageUrl
    }),
    comment: v.optional(v.string()), // Optional because not all activities have a comment
    date: v.string(),
    dateTime: v.string(),
  }),

  tests: defineTable({
    actual: v.string(),
    desc: v.string(),
    developer: v.array(v.string()),
    expected: v.string(),
    notes: v.string(),
    status: v.string(),
    createdBy: v.string(),
    createdByImageUrl: v.string(),
  }).searchIndex("search_desc", {
    searchField: "desc",
  }),
});
