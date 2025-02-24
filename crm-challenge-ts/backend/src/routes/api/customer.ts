import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import {
  getCustomer,
  addCustomer,
  getAllCustomers,
  findCustomerByEmail,
  addTssToCustomer,
} from '../../db/queries';

interface PostgresError extends Error {
  code: string;
}

// TS Ignore is used to suppress the error that the body property is not found on the request object. Its generally better to define proper interfaces.

export default async function customer(fastify: FastifyInstance) {
  // Route to get customer by ID
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
  
  // Route to add a new customer
  fastify.route({
    method: 'POST',
    url: '/customer/add',
    schema: {
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
        },
        required: ['firstName', 'lastName', 'email'],
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      // @ts-ignore
      const { firstName, lastName, email } = request.body;
      try {
        const existingCustomer = await findCustomerByEmail(email);
        // @ts-ignore
        const customer_id = existingCustomer.length > 0 ? existingCustomer[0].customer_id : uuidv4();
        const result = await addCustomer(customer_id, firstName, lastName, email);
        reply.send({ success: true, customer: result[0] });
      } catch (error) {
        console.error('Failed to add customer:', error);
        reply.code(500).send({ success: false, message: 'Failed to add customer' });
      }
    },
  });

  // Route to retrieve all customers
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
    },
  });

  // Route to add TSS to a customer
  fastify.route({
    method: 'POST',
    url: '/customer/add-tss',
    schema: {
      body: {
        type: 'object',
        properties: {
          customerId: { type: 'string', description: 'UUID of the customer' },
          tssId: { 
            type: 'string', 
            nullable: true, 
            description: 'Optional TSS ID. If not provided, a new one will be generated' 
          }
        },
        required: ['customerId'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            customer: {
              type: 'object',
              properties: {
                customer_id: { type: 'string' },
                first_name: { type: 'string' },
                last_name: { type: 'string' },
                mail: { type: 'string' },
                tss_id: { type: 'string' }
              }
            },
            message: { type: 'string' },
            newTssCreated: { type: 'boolean' }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // @ts-ignore
        const { customerId, tssId } = request.body;
        
        // First check if customer exists
        const existingCustomer = await getCustomer(customerId);
        
        if (existingCustomer.length === 0) {
          reply.code(404).send({ 
            success: false, 
            message: 'Customer not found. Please create the customer first.' 
          });
          return;
        }
        
        // Generate new TSS ID if not provided
        const newTssId = tssId || uuidv4();
        
        const result = await addTssToCustomer(customerId, newTssId);
        
        reply.send({ 
          success: true, 
          customer: result[0],
          message: 'TSS successfully added to customer',
          newTssCreated: !tssId // Indicate if we generated a new TSS ID
        });
      } catch (error: unknown) {
        console.error('Failed to add TSS:', error);

        if (error && typeof error === 'object' && 'code' in error) {
          const pgError = error as PostgresError;
          
          // Check if error is related to UUID validation
          if (pgError.code === '22P02') {
            reply.code(400).send({ 
              success: false, 
              message: 'Invalid UUID format provided for customer ID or TSS ID' 
            });
            return;
          }
        }
        
        reply.code(500).send({ 
          success: false, 
          message: 'Failed to add TSS. Please try again.' 
        });
      }
    },
  });
}
