import fastify from 'fastify'
import { goalsRoutes } from './routes/goals'
import fastifyCors from '@fastify/cors'

export const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})
app.register(goalsRoutes, {
  prefix: '/goals',
})
