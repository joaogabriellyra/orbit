import fastify from "fastify";

const app = fastify()

app.listen({ port: 3000}).then(() => {
  console.log('http server listening on port 3000')
} )