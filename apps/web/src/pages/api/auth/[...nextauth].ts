import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const prisma = new PrismaClient();

// class InvalidLoginError extends CredentialsSignin {
// 	code = "Invalid identifier or password";
// }

export default NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			credentials: {
				username: {},
				password: {},
			},
			async authorize(credentials) {
				console.log(credentials);
			},
		}),
	],
});
