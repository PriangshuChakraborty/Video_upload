import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@hotmail.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials || !credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }
        try {
          await dbConnect();

          const { email, password } = credentials;

          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("No user found with the provided email.");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid password.");
          }

          return { 
            id: user._id.toString(), 
            email: user.email 
        };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("An error occurred during authorization.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
    pages: {
        signIn: "/login",
        error: "/login", 
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret:process.env.NEXTAUTH_SECRET!

};
