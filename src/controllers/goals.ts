import type { FastifyReply, FastifyRequest } from 'fastify'

export default class GoalsController {
  private req: FastifyRequest
  private reply: FastifyReply
  private service: GoalsService
  constructor(req: FastifyRequest, reply: FastifyReply) {
    this.req = req
    this.reply = reply
    this.service = new GoalsService()
  }
}
