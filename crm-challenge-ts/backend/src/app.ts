import { FastifyInstance } from 'fastify';
import customer from './routes/api/customer';

declare module 'fastify' {
    interface FastifyInstance {
        config: { [key: string]: any };
    }
}

export default async function app(fastify: FastifyInstance) {
  fastify.register(customer);

  if (process.env.NODE_ENV === 'development') {
    fastify.ready(() => {
      console.log(fastify.printRoutes());
    });
  }
}