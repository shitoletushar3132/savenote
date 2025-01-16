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
  const searchQuery = url.searchParams.get("query")?.trim();

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
      console.log("blank", searchResults);
      return NextResponse.json(searchResults, { status: 200 });
    }

    return NextResponse.json(searchResults, { status: 200 });
  } catch (error: unknown) {
    console.error("Error searching notes:", error);
    return NextResponse.json(
      { error: "An error occurred while searching notes" },
      { status: 500 }
    );
  }
}
