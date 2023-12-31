import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tests").collect();
  },
});

export const getTestById = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, { testId }) => {
    const test = await ctx.db.get(testId);
    return test;
  },
});

export const addTest = mutation({
  args: {
    actual: v.string(),
    desc: v.string(),
    developer: v.array(v.string()),
    expected: v.string(),
    notes: v.string(),
    status: v.string(),
    createdBy: v.string(),
    createdByImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const testId = await ctx.db.insert("tests", args);
  },
});

export const deleteTest = mutation({
  args: { id: v.id("tests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const searchTests = query({
  args: { searchString: v.string() },
  handler: async (ctx, { searchString }) => {
    return await ctx.db
      .query("tests")
      .withSearchIndex("search_desc", (q) => q.search("desc", searchString))
      .collect();
  },
});

export const updateTestStatus = mutation({
  args: {
    id: v.id("tests"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const editTestMutilation = mutation({
  args: {
    testId: v.id("tests"),
    updatedFields: v.object({
      actual: v.optional(v.string()),
      desc: v.optional(v.string()),
      developer: v.optional(v.array(v.string())),
      expected: v.optional(v.string()),
      notes: v.optional(v.string()),
      status: v.optional(v.string()),
      createdBy: v.optional(v.string()),
      createdByImageUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { testId, updatedFields }) => {
    await ctx.db.patch(testId, updatedFields);
    // Optionally return a value, e.g., the updated test
  },
});
