import type { FastifyPluginAsync } from "fastify";

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get("/", async (request, reply) => ({
		status: "ok",
	}));
};

export default tasks;
