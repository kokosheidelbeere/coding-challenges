import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { getCustomer, addCustomer, getAllCustomers } from '../../db/queries';


export default async function customer(fastify: FastifyInstance){
  fastify.route({
    method: 'POST',
    url: '/customer',
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            customer_id: {
              type: 'string'
            },
            first_name: {
              type: 'string'
            },
            last_name: {
              type: 'string'
            },
            mail: {
              type: 'string'
            }
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          customer: { type: 'string' }
        },
        required: ['customer_id']
      }
    },
    // this function is executed for every request before the handler is executed
    preHandler: (request: FastifyRequest, reply: FastifyReply, done) => {
      // E.g. check authentication
      done();
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // @ts-ignore
      const customerId: string = request.body['customer_id'];
      console.log(request.body);
      const customerResult: string[] = await getCustomer(customerId);

      reply.send(customerResult);
    }
  });

  //new route to add customer
  fastify.route({
    method: 'POST',
    url: '/customer/add',
    schema: {
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' }
        },
        required: ['firstName', 'lastName', 'email']
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // @ts-ignore - to handle body type
      const { firstName, lastName, email } = request.body;
      
      try {
        const result = await addCustomer(firstName, lastName, email);
        reply.send({ success: true, customer: result[0] });
      } catch (error) {
        console.error('Failed to add customer:', error);
        reply.code(500).send({ success: false, message: 'Failed to add customer' });
      }
    }
  });

  //new route to retrieve ALL customers
  fastify.route({
    method: 'GET',
    url: '/customers',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const customers = await getAllCustomers();
        reply.send(customers);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        reply.code(500).send({ message: 'Failed to fetch customers' });
      }
    }
  });
}