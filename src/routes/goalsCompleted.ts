import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import GoalsCompletedController from '../controllers/goalsCompleted'

export async function goalsCompletedRouter(app: FastifyInstance) {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) =>
    new GoalsCompletedController(req, reply).getGoalsCompleted()
  )
}
