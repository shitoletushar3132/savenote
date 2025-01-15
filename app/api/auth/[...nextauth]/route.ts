import { NEXT_AUTH } from "@/app/lib/auth";
import NextAuth from "next-auth";

//@ts-expect-error: Ignorging
const handler = NextAuth(NEXT_AUTH);

export const GET = handler;
export const POST = handler;
