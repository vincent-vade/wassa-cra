import {FastifyPluginAsync} from "fastify"

import {makeProjectRepository} from "../../../data/postgres/repositories/projectRepository";
import {AppOptions} from "../../../app";

const projects: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  const projectRepository = makeProjectRepository(fastify.pg);

  fastify.get('/', async (request, reply)=> {
    return {
      projects: await projectRepository.findAll()
    }
  })
}

export default projects;
