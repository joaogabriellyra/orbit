import fastify from 'fastify'
import { goalsRoutes } from './routes/goals'

export const app = fastify()

app.register(goalsRoutes, {
  prefix: '/goals',
})
