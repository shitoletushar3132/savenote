"use client";

import React, { useEffect, useRef, useState } from "react";
import Card from "@/components/Card";

const Notepage = ({
  searchValue,
  refresh,
}: {
  searchValue: string;
  refresh: boolean;
}) => {
  const [notes, setNotes] = useState<any[]>([]); // State for storing notes
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error messages
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      setNotes(data);
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      setError("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notes/search?query=${searchValue}`);
      if (!response.ok) {
        const data = await response.json();
        console.log("before", data);
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      console.log("after", data);
      setNotes(data);
    } catch (error: any) {
      console.log("Error fetching search results:", error);
      setError("Failed to fetch search results hi" + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, [refresh]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current); // Clear the previous timeout
    }

    debounceTimeout.current = setTimeout(async () => {
      if (searchValue.trim()) {
        await fetchSearchData();
      } else {
        await fetchData();
      }
    }, 500); // Adjust debounce delay (500ms)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // Cleanup on unmount
      }
    };
  }, [searchValue]);

  if (loading) {
    return <h1 className="font-bold text-lg text-center">Loading...</h1>;
  }

  if (error) {
    return (
      <h1 className="font-bold text-lg text-red-500 text-center">{error}</h1>
    );
  }

  if (!Array.isArray(notes) || notes.length === 0) {
    return <h1 className="font-bold text-lg text-center">Add Notes...</h1>;
  }

  return (
    <span className="flex flex-wrap items-stretch">
      {notes?.map((note) => (
        <Card key={note?.id} {...note} fetchData={fetchData} />
      ))}
    </span>
  );
};

export default Notepage;
