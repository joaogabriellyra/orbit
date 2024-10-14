import type { FastifyReply, FastifyRequest } from 'fastify'

export default class GoalsCompletedController {
  private req: FastifyRequest
  private reply: FastifyReply
  private service: GoalsCompletedService
  constructor(req: FastifyRequest, reply: FastifyReply) {
    this.req = req
    this.reply = reply
    this.service = new GoalsCompletedService()
  }
}
