import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { makeProjectRepository } from "../../../../data/postgres/repositories/projectRepository";

type RouteWithParamsId = {
	Params: {
		id: string;
	};
};

const projects: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	const projectRepository = makeProjectRepository(fastify.pg);

	fastify.get(
		"/",
		async (request: FastifyRequest<RouteWithParamsId>, reply) => {
			return {
				projects: await projectRepository.findOne(request.params.id),
			};
		},
	);
};

export default projects;
