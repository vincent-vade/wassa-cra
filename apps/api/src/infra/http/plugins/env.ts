import fastifyEnv, { type FastifyEnvOptions } from "@fastify/env";
import fp from "fastify-plugin";

const schema = {
	type: "object",
	required: ["DATABASE_URL"],
	properties: {
		DATABASE_URL: { type: "string" },
	},
};

export type Env = {
	DATABASE_URL: string;
};

declare module "fastify" {
	interface FastifyInstance {
		config: Env;
	}
}

export default fp<FastifyEnvOptions>(async (fastify) => {
	await fastify.register(fastifyEnv, {
		dotenv: true,
		schema,
	});
});
