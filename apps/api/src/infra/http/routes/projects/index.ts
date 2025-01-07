import { FastifyPluginAsync } from "fastify"

const projects: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return {
      status: 'ok'
    }
  })
}

export default projects;
