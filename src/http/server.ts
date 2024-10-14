import { app } from '../app'
import { env } from '../env'

app.listen({ port: env.PORT }, () => {
  console.log(`http server listening on port ${env.PORT}`)
})
