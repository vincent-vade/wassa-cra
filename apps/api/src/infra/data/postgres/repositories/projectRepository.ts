import {ProjectRepository} from "../../../../domain/projects/repository";

import {createProject, deleteProject, findAllProjects, findProjectById} from "../queries/projects.queries";
import {PostgresDb} from "@fastify/postgres";

export const makeProjectRepository = (pg: PostgresDb): ProjectRepository => {
  return {
    async create(data) {
      return createProject.run(data, pg)
    },
    async delete(id){
      await deleteProject.run({
        projectId: id,
      }, pg);
    },
    async findAll(){
      return findAllProjects.run(undefined, pg)
    },
    async findOne(id) {
      return findProjectById.run({
        projectId: id
      }, pg)
    },
    async update(id: string, data: Partial<any>): Promise<{ id: string }> {
      return Promise.resolve({id: ""});
    }
  }
}