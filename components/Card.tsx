"use client";

import { Note } from "@prisma/client";
import React, { useState } from "react";
import { Palette } from "lucide-react";
import axios from "axios";
interface CardProps extends Note {
  fetchData: () => void;
}

const Card = ({ fetchData, ...note }: CardProps) => {
  const [selected, setSelected] = useState<Note | null>(null);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  const [color, setColor] = useState(note.color);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    "#ffffff", // White
    "#f28b82", // Red
    "#fbbc04", // Orange
    "#fff475", // Yellow
    "#ccff90", // Green
    "#a7ffeb", // Teal
    "#cbf0f8", // Blue
    "#aecbfa", // Dark blue
    "#d7aefb", // Purple
    "#fdcfe8", // Pink
    "#e6c9a8", // Brown
    "#e8eaed", // Gray
  ];

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  const handleSave = async ({ id }: { id: Note["id"] }) => {
    console.log(id); // Logs the id to verify it's being received
    try {
      const response = await axios.patch(`/api/notes`, {
        id, // Pass the id of the note being updated
        title,
        description,
        color,
      });
      fetchData();
      console.log("Note updated successfully:", response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new Error(error.message);
      } else {
        console.log("Unknown error", error);
        throw new Error("An unknown error occurred");
      }
    }
    setShow(false); // Close the editing mode or modal
  };

  const handleDelete = async ({ id }: { id: Note["id"] }) => {
    try {
      await axios.delete("/api/notes", {
        data: { id },
      });
      fetchData();
    } catch (error: any) {
      console.error("Error updating note:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          setSelected(note);
          setShow(true);
        }}
        style={{ backgroundColor: color }}
        className={`
          transition-all duration-200 ease-in-out
          border border-border/40 hover:border-border/80
          rounded-lg p-4 
          shadow-sm hover:shadow-md
          cursor-pointer
          w-full md:w-72
          relative
          m-4
        `}
      >
        <div className="font-medium text-lg text-foreground/90">
          <h3 className="line-clamp-2">{note.title}</h3>
        </div>
        <div className="whitespace-pre-wrap mt-2 text-sm text-foreground/70 line-clamp-6">
          {note.description}
        </div>
        <div className="absolute bottom-4 right-4 text-xs text-foreground/50">
          {formatDate(note.updatedAt)}
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShow(false)}
          />
          <div
            style={{ backgroundColor: color }}
            className="relative w-full max-w-[600px] rounded-lg shadow-lg p-6 animate-in zoom-in-95 duration-200"
          >
            <div className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-0 text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-foreground/50"
                placeholder="Title"
                autoFocus
              />
              <textarea
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-0 text-base bg-transparent border-none focus:outline-none focus:ring-0 min-h-[200px] resize-none placeholder:text-foreground/50"
                placeholder="Take a note..."
                rows={8}
              />
              <div className="text-right text-xs text-foreground/50">
                {formatDate(note.updatedAt)}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
                  title="Change color"
                >
                  <Palette className="w-5 h-5 text-foreground/70" />
                </button>
                {showColorPicker && (
                  <div className="absolute bottom-full left-0 mb-2 p-2 bg-popover rounded-lg shadow-lg grid grid-cols-6 gap-1 animate-in slide-in-from-bottom-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setColor(c);
                          setShowColorPicker(false);
                        }}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border border-border/20 hover:border-border/60 transition-colors ${
                          color === c ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-6 py-2 text-sm font-medium text-red-600 text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-secondary/80"
                  onClick={() => handleDelete({ id: note.id })}
                >
                  Delete
                </button>
                <button
                  onClick={() => setShow(false)}
                  className="px-6 py-2 text-sm text-blue-600 font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-secondary/80"
                >
                  Close
                </button>
                <button
                  onClick={() => handleSave({ id: note.id })}
                  className="px-6 py-2 text-green-600 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full hover:bg-secondary/80"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
