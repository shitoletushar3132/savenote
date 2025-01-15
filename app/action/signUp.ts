"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const signUp = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    // Create a new user with P
    // risma

    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (user) {
      throw new Error("User Already Exists");
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const resUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        image:
          "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg",
        provider: "Credentials",
      },
    });

    return resUser;
  } catch (error: unknown) {
    // Handle the error properly
    if (error instanceof Error) {
      console.log(error.message);
      throw new Error(error.message);
    } else {
      console.log("Unknown error", error);
      throw new Error("An unknown error occurred");
    }
  }
};
