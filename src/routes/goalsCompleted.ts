import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function goalsCompletedRouter(app: FastifyInstance) {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) =>
    new GoalsCompletedController(req, reply).getGoalsCompleted()
  )
}
