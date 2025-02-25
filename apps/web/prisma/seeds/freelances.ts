import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import argon2 from "argon2";

const prisma = new PrismaClient({
	log: ["query"],
}).$extends(withAccelerate());

async function addFreelances() {
	console.log("begin seed => freelances");

	await prisma.$connect();

	console.log("Cleaning freelances");
	await prisma.freelances.deleteMany();

	try {
		await prisma.freelances.createMany({
			data: [
				{
					email: "gaelcadoret21@gmail.com",
					daily_rate: 750,
					password: await argon2.hash("password1234!"),
				},
				{
					email: "vincent.vade@gmail.com",
					daily_rate: 530,
					password: await argon2.hash("password56789!"),
				},
			],
		});
	} catch (e) {
		console.error(e);
	}

	await prisma.$disconnect();
	console.log("success seed :rocket");
}

addFreelances();
