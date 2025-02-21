import envSchema from 'env-schema';
require('dotenv').config();

const config =  {
    VERSION: {
        type: 'string',
        default: '0.1.0',
    },
    PSQL_HOST: {
        type: 'string',
        //default is locahost
        default: 'postgres',
    },
    PSQL_PORT: {
        type: 'number',
        default: 5432,
    },
    PSQL_USER: {
        type: 'string',
        default: 'postgres',
    },
    PSQL_PASSWORD: {
        type: 'string',
        default: "postgres1234"
    },
    PSQL_DB: {
        type: 'string',
        default: 'postgres',
    },
    BACKEND_PORT: {
        type: 'number',
        default: 3001,
    },
    BACKEND_HOST: {
        type: 'string',
        default: 'localhost'
    },
};


export const schema = {
    type: 'object',
    required: Object.keys(config),
    properties: config,
};

export default envSchema({ schema });
