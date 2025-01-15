"use client";

import { addNote } from "@/app/lib/note";
import React, { useState, useRef, useEffect } from "react";
import { Palette, Plus } from "lucide-react";
import { cn } from "@/app/lib/utils";
interface Note {
  title: string;
  description: string;
  color: string;
}

const AddNote = () => {
  const [note, setNote] = useState<Note>({
    title: "",
    description: "",
    color: "#ffffff",
  });
  const [showDescription, setShowDescription] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (showDescription) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDescription]);

  const handleClose = () => {
    if (note.title.trim() || note.description.trim()) {
      handleAddNote();
    }
    setShowDescription(false);
    setShowColorPicker(false);
    setNote({ title: "", description: "", color: "#ffffff" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNote((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "description" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleAddNote = async () => {
    console.log("handle");
    if (note.title.trim() || note.description.trim()) {
      await addNote(note);
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      <div
        ref={formRef}
        style={{ backgroundColor: note.color }}
        className={cn(
          "relative rounded-lg border shadow-sm transition-shadow duration-200",
          showDescription ? "shadow-lg" : "hover:shadow-md"
        )}
      >
        <div className="p-4">
          {!showDescription && (
            <div
              onClick={() => setShowDescription(true)}
              className="flex items-center gap-4 text-muted-foreground cursor-text"
            >
              <Plus className="w-5 h-5" />
              <span>Take a note...</span>
            </div>
          )}

          {showDescription && (
            <div className="space-y-3">
              <input
                name="title"
                value={note.title}
                onChange={handleChange}
                onClick={() => setShowColorPicker(false)}
                className="w-full bg-transparent text-lg font-medium placeholder:text-muted-foreground/60 focus:outline-none"
                placeholder="Title"
                autoFocus
              />
              <textarea
                ref={textareaRef}
                name="description"
                value={note.description}
                onChange={handleChange}
                onClick={() => setShowColorPicker(false)}
                className="w-full bg-transparent resize-none placeholder:text-muted-foreground/60 focus:outline-none min-h-[50px]"
                placeholder="Take a note..."
                rows={1}
              />
            </div>
          )}
        </div>

        {showDescription && (
          <div className="flex items-center justify-between p-2 border-t">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
                title="Background options"
              >
                <Palette className="w-5 h-5 text-foreground/70" />
              </button>

              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-popover rounded-lg shadow-lg grid grid-cols-6 gap-1 z-10 animate-in slide-in-from-top-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setNote((prev) => ({ ...prev, color }));
                        setShowColorPicker(false);
                      }}
                      style={{ backgroundColor: color }}
                      className={cn(
                        "w-6 h-6 rounded-full border transition-all hover:shadow-md",
                        note.color === color &&
                          "ring-2 ring-primary ring-offset-2"
                      )}
                      title={color === "#ffffff" ? "Default" : ""}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-1.5 text-md font-semibold hover:bg-black/5 rounded-md transition-colors text-green-800"
            >
              SAVE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNote;
