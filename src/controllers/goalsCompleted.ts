import type { FastifyReply, FastifyRequest } from 'fastify'
import GoalsCompletedService from '../services/goalsCompleted'

export default class GoalsCompletedController {
  private req: FastifyRequest
  private reply: FastifyReply
  private service: GoalsCompletedService
  constructor(req: FastifyRequest, reply: FastifyReply) {
    this.req = req
    this.reply = reply
    this.service = new GoalsCompletedService()
  }

  public async getGoalsCompleted() {
    try {
      const goalsCompleted = await this.service.getCompletedGoals()
      this.reply.status(200).send(goalsCompleted)
    } catch (error) {
      this.reply.status(500).send({ error })
    }
  }
}
