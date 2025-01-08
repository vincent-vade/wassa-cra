import fp from 'fastify-plugin'
import fastifyPostgres, { FastifyPostgresRouteOptions } from '@fastify/postgres'

export default fp<FastifyPostgresRouteOptions>(async (fastify) => {
  fastify.register(fastifyPostgres, {
    connectionString: fastify.config.DATABASE_URL
  })
})
