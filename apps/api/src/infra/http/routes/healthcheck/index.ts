import type { FastifyPluginAsync } from "fastify";

const healthcheck: FastifyPluginAsync = async (
	fastify,
	opts,
): Promise<void> => {
	fastify.get("/", async (request, reply) => ({
		status: "ok",
	}));
};

export default healthcheck;
