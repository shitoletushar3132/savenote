import { NEXT_AUTH } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const searchQuery = url.searchParams.get("query")?.trim(); // Trimming any extra spaces

  if (!searchQuery) {
    return NextResponse.json(
      { error: "Search query cannot be empty" },
      { status: 400 }
    );
  }

  try {
    const searchResults = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { title: { contains: searchQuery, mode: "insensitive" } },
          { description: { contains: searchQuery, mode: "insensitive" } },
        ],
      },
      orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
    });

    if (searchResults.length === 0) {
      return NextResponse.json({ message: "No notes found" }, { status: 200 });
    }

    return NextResponse.json(searchResults, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to search notes" },
        { status: 500 }
      );
    } else {
      console.log("Unknown error", error);
      throw new Error("An unknown error occurred");
    }
  }
}
