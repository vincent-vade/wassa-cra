import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.$connect();
	console.log("begin seed");
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
	await prisma.$disconnect();
	console.log("success seed :rocket");
}

main();
