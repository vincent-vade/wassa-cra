import { FastifyPluginAsync } from "fastify"

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return {
      status: 'ok'
    }
  })
}

export default tasks;
