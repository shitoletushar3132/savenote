"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import { PrismaClient } from "@prisma/client"; // Only import PrismaClient

const prisma = new PrismaClient(); // Create an instance of PrismaClient

const Notepage = ({ searchValue }: { searchValue: string }) => {
  const [notes, setNotes] = useState<any[]>([]); // State type is inferred as an array of notes

  const fetchData = async () => {
    try {
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      console.log(response);
      const data = await response.json();
      setNotes(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchSearchData = async () => {
    try {
      const response = await fetch(`/api/notes/search?query=${searchValue}`);
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      console.log(response);
      const data = await response.json();
      setNotes(data);
    } catch (error: any) {
      console.log(error);
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchData, 3000);

    // Fetch data immediately on mount
    fetchData();

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch search data when searchValue changes
    if (searchValue.trim()) {
      fetchSearchData();
    } else {
      fetchData();
    }
  }, [searchValue]);

  return (
    <span className="flex flex-wrap items-stretch">
      {notes?.map((note) => (
        <Card key={note.id} {...note} fetchData={fetchData} />
      ))}
    </span>
  );
};

export default Notepage;
