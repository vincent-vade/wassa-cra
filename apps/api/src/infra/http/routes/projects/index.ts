import type { FastifyPluginAsync } from "fastify";

import type { AppOptions } from "../../../app";
import { makeProjectRepository } from "../../../data/postgres/repositories/projectRepository";

const projects: FastifyPluginAsync<AppOptions> = async (
	fastify,
	opts,
): Promise<void> => {
	const projectRepository = makeProjectRepository(fastify.pg);

	fastify.get("/", async (request, reply) => {
		return {
			projects: await projectRepository.findAll(),
		};
	});
};

export default projects;
