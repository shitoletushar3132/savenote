"use server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, color } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Missing required fields title" },
        { status: 400 }
      );
    }

    const newNote = await prisma.note.create({
      data: {
        userId: session.user.id,
        title,
        description,
        color,
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to create note" },
        { status: 500 }
      );
    } else {
      console.log("Unknown error", error);
      throw new Error("An unknown error occurred");
    }
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const path = url.pathname;

  if (path == "/search") {
    const searchQuery = url.searchParams.get("query"); // Example of using a query parameter

    if (searchQuery) {
      try {
        const searchResults = await prisma.note.findMany({
          where: {
            userId: session.user.id,
            title: { contains: searchQuery, mode: "insensitive" },
            description: { contains: searchQuery, mode: "insensitive" }, // Example search by title
          },
          orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
        });
        return NextResponse.json(searchResults, { status: 200 });
      } catch (error: unknown) {
        return NextResponse.json(
          { error: "Failed to search notes" },
          { status: 500 }
        );
      }
    } else {
      const notes = await prisma.note.findMany({
        where: { userId: session.user.id },
        orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
      });
      return NextResponse.json(notes, { status: 200 });
    }
  } else {
    try {
      const notes = await prisma.note.findMany({
        where: { userId: session.user.id },
        orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
      });
      return NextResponse.json(notes, { status: 200 });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message || "Failed to create note" },
          { status: 500 }
        );
      } else {
        console.log("Unknown error", error);
        throw new Error("An unknown error occurred");
      }
    }
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);

  // Check if the user is authorized
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the request body
    const body = await req.json();
    const {
      id,
      title,
      description,
      color,
    }: { id: number; title: string; description: string; color: string } = body;

    // Fetch the note to verify ownership
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if the authenticated user is the creator of the note
    if (note.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to edit this note" },
        { status: 403 }
      );
    }

    // Update the note in the database
    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        description,
        color,
        updatedAt: new Date(),
      },
    });

    // Respond with the updated note
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to edit notes" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);

  // Check if the user is authorized
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the request body
    const body = await req.json();
    const { id }: { id: number } = body;
    console.log(id);

    // Fetch the note to verify ownership
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if the authenticated user is the creator of the note
    if (note.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You do not have permission to edit this note" },
        { status: 403 }
      );
    }

    // Update the note in the database
    const deletedNote = await prisma.note.delete({
      where: { id },
    });

    // Respond with the updated note
    return NextResponse.json(deletedNote, { status: 200 });
  } catch (error) {
    console.error("Error Deleteing note:", error);
    return NextResponse.json(
      { error: "Failed to delete notes" },
      { status: 500 }
    );
  }
}
