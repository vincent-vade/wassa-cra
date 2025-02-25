import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
	log: ["query"],
})
	.$extends(withAccelerate());

async function addProjects() {
	console.log("begin seed => projects & projects_tasks");

	await prisma.$connect();

	console.log("cleaning database...");
	await prisma.timesheets.deleteMany();
	await prisma.projects_tasks.deleteMany();
	await prisma.projects.deleteMany();
	await prisma.clients.deleteMany();

	try {
		const client1 = await prisma.clients.create({
			data: {
				name: "Chanel",
				email: "contact@chanel.com",
				phone: "+1234567890",
			}
		});

		const project1 = await prisma.projects.create({
			data: {
				is_active: true,
				name: "Headless ONE",
				client_id: client1.id,
			}
		})

		const project2 = await prisma.projects.create({
			data: {
				is_active: true,
				name: "Puls",
				client_id: client1.id,
			}
		})

		await prisma.projects_tasks.createMany({
			data: [
				{
					task_description: "JavaScript development",
					project_id: project1.id,
				},
				{
					task_description: "Devops (Infra/Maintenance)",
					project_id: project1.id,
				},
				{
					task_description: "JavaScript development",
					project_id: project2.id,
				},
			],
		});
	} catch (e) {
		console.error(e)
	}

	await prisma.$disconnect();
	console.log("success seed :rocket");
}

addProjects();
