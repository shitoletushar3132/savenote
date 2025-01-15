import CredentialsProvider from "next-auth/providers/credentials";

import GoogleProvider from "next-auth/providers/google";
import { Account, Profile } from "next-auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface Credentials {
  email: string;
  password: string;
}

interface UserType {
  id: number | string;
  name: string;
  email: string;
}

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: {
          label: "eamil",
          type: "text",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      //@ts-expect-error:helo
      async authorize(credentials: Credentials) {
        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (
            user &&
            (await bcrypt.compare(credentials.password, user.password || ""))
          ) {
            // Return user object if authentication is successful
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }

          return null; // Return null if authentication fails
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "tushar",
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: UserType;
      account: Account;
      profile: Profile;
    }) {
      try {
        if (account.provider === "google") {
          // Check if the user exists in the database
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!existingUser) {
            // Create a new user if not found
            user = await prisma.user.create({
              data: {
                name: profile.name || "",
                email: profile.email || "",
                //@ts-expect-error: no picture
                image: profile.picture,
                provider: account.provider,
              },
            });
          } else {
            // Update the user's details
            user = await prisma.user.update({
              where: { email: profile.email },
              data: {
                name: profile.name,
                //@ts-expect-error: no picture
                image: profile.picture,
              },
            });
          }
        }
        return user; // Allow sign-in
      } catch (error) {
        console.error("Error saving user to database:", error);
        return false; // Deny sign-in on error
      }
    },
    async jwt({
      token,
    }: {
      token: {
        email: string;
        userId: number;
        // Add other properties as necessary
      };
    }) {
      const dataUser = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });

      if (dataUser) token.userId = dataUser.id;

      return token;
    },
    async session({ session, token }: any) {
      if (token.userId) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  // pages: {
  //   signIn: "/auth/signin",
  //   error: "/auth/error",
  // },
};
