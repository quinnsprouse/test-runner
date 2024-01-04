"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context data
interface SearchContextType {
  searchString: string;
  setSearchString: (searchString: string) => void;
}

// Create the context with a default value
const SearchContext = createContext<SearchContextType | null>(null);

// Create a custom hook for using this context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

// Define the SearchProvider component with proper type for children
export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchString, setSearchString] = useState("");

  return (
    <SearchContext.Provider value={{ searchString, setSearchString }}>
      {children}
    </SearchContext.Provider>
  );
};
