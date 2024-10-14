import type { FastifyReply, FastifyRequest } from 'fastify'
import GoalsService from '../services/goals'
import { createGoalBodySchema } from '../schemas/goals'

export default class GoalsController {
  private req: FastifyRequest
  private reply: FastifyReply
  private service: GoalsService
  constructor(req: FastifyRequest, reply: FastifyReply) {
    this.req = req
    this.reply = reply
    this.service = new GoalsService()
  }

  public async createGoal() {
    try {
      const newGoal = createGoalBodySchema.parse(this.req.body)
      await this.service.create(newGoal)
      this.reply.status(201).send()
    } catch (error) {
      this.reply.status(500).send({ error })
    }
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
