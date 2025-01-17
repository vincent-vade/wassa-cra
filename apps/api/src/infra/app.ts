import { join } from "node:path";
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import type { FastifyPluginAsync, FastifyServerOptions } from "fastify";

export interface AppOptions
	extends FastifyServerOptions,
		Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
	fastify,
	opts,
): Promise<void> => {
	void fastify.register(AutoLoad, {
		dir: join(__dirname, "http", "plugins"),
		options: opts,
	});

	void fastify.register(AutoLoad, {
		dir: join(__dirname, "http", "routes"),
		routeParams: true,
		options: opts,
	});
};

export default app;
export { app, options };
