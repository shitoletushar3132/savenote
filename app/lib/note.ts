import axios from "axios";

export const addNote = async (note: {
  title: string;
  description: string;
  color: string;
}) => {
  try {
    const response = await axios.post("/api/notes", note, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Note added successfully:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error) {
      console.log(error.message);
      throw new Error(error.message);
    } else {
      console.log("Unknown error", error);
      throw new Error("Faild to add");
    }
  }
};
