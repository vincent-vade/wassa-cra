import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
	log: ["query"],
}).$extends(withAccelerate());;

async function addFreelances() {
	console.log("begin seed => freelances");

	await prisma.$connect();

	try {
		await prisma.freelances.createMany({
			data: [
				{
					email: "gaelcadoret21@gmail.com",
					daily_rate: 750,
				},
				{
					email: "vincent.vade@gmail.com",
					daily_rate: 530,
				}
			],
		});
	} catch (e) {
		console.error(e)
	}

	await prisma.$disconnect();
	console.log("success seed :rocket");
}

addFreelances();
