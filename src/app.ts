import fastify from 'fastify'
import { goalsRoutes } from './routes/goals'
import { goalsCompletedRouter } from './routes/goalsCompleted'

export const app = fastify()

app.register(goalsRoutes, {
  prefix: '/goals',
})
app.register(goalsCompletedRouter, {
  prefix: '/goalscompleted',
})
