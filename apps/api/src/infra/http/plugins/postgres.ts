import fastifyPostgres, {
	type FastifyPostgresRouteOptions,
} from "@fastify/postgres";
import fp from "fastify-plugin";

export default fp<FastifyPostgresRouteOptions>(async (fastify) => {
	fastify.register(fastifyPostgres, {
		connectionString: fastify.config.DATABASE_URL,
	});
});
