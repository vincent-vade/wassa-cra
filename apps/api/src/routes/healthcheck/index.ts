import { FastifyPluginAsync } from "fastify"

const healthcheck: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return {
      status: 'ok'
    }
  })
}

export default healthcheck;
