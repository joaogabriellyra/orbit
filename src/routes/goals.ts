import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function goalsRoutes(app: FastifyInstance) {
  app.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    await new GoalsController.createGoal(req, reply)
  })
}
