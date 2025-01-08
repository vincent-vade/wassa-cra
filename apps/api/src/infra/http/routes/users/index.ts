import type { FastifyPluginAsync } from "fastify";

const users: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get("/", async (request, reply) => ({
		status: "ok",
	}));
};

export default users;
