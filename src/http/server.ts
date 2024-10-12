import fastify from 'fastify'
import { env } from '../env'

const app = fastify()
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`http server listening on port ${env.PORT}`)
  })
