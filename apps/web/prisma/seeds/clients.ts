import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
	log: ["query"],
}).$extends(withAccelerate());;

async function addClients() {
	console.log("begin seed => clients");

	await prisma.$connect();

	try {
		await prisma.clients.createMany({
			data: [
				{
					name: "Client 1",
					email: "KlT2d@example.com",
					phone: "+1234567890",
				},
				{
					name: "Client 2",
					email: "KlT2d@example.com",
					phone: "+1234567890",
				},
				{
					name: "Client 3",
					email: "KlT2d@example.com",
					phone: "+1234567890",
				},
				{
					name: "Client 4",
					email: "KlT2d@example.com",
					phone: "+1234567890",
				},
			],
		});
	} catch (e) {
		console.error(e)
	}

	await prisma.$disconnect();
	console.log("success seed :rocket");
}

addClients();
