import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import GoalsController from '../controllers/goals'

export async function goalsRoutes(app: FastifyInstance) {
  app.post('/', async (req: FastifyRequest, reply: FastifyReply) =>
    new GoalsController(req, reply).createGoal()
  )
  app.get('/completed', async (req: FastifyRequest, reply: FastifyReply) =>
    new GoalsController(req, reply).getGoalsCompleted()
  )

  app.get('/pending', async (req: FastifyRequest, reply: FastifyReply) =>
    new GoalsController(req, reply).getWeekPendingGoals()
  )

  app.post('/complete', async (req: FastifyRequest, reply: FastifyReply) =>
    new GoalsController(req, reply).completeAGoal()
  )
}
