import {OpenAPIBackend} from 'openapi-backend';;
import express from 'express';
const app = express();
app.use(express.json());
// define api
const api = new OpenAPIBackend({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Android',
      version: '1.0.0',
    },
    paths: {
      '/pets': {
        get: {
          operationId: 'getPets',
          responses: {
            200: { description: 'ok' },
          },
        },
      },
      
      '/pets/{id}': {
        get: {
          operationId: 'getPetById',
          responses: {
            200: { description: 'ok' },
          },

        },
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
      },
      '/users': {
        get: {
          operationId: 'getUsers',
          responses: {
            200: { description: 'ok' },
          },
        },
      },
      '/users/create':{
        post: {
          operationId: 'createUser',
          responses:{
            200:{description: 'account created'}
          }
        }
      },
      '/user/get':{
        get:{
          operationId: 'getUser',
          responses: {
            200:{description:'user retrieved'}
          }
        }
      }
    },
  },
  handlers: {
    getPets: async (c, req, res) => res.status(200).json({ operationId: c.operation.operationId }),
    getPetById: async (c, req, res) => {
      const petNames = [{name: 'jacob'}, {name: 'garfield'}, {name: 'jerry'}];
      const petId = c.request.params.id;
      const petName = petNames[petId - 1]?.name;
    
      if (!petName) {
        return res.status(404).json({ error: 'Pet not found' });
      }
    
      const responseData = {
        operationId: c.operation.operationId,
        name: petName
      };
      
      return res.status(200).json(responseData);
    } ,
    validationFail: async (c, req, res) => res.status(400).json({ err: c.validation.errors }),
    notFound: async (c, req, res) => res.status(404).json({ err: 'not found' }),

  },
});


api.init();

// use as express middleware
app.use((req, res) => api.handleRequest(req, req, res));

// start server
app.listen(9000, () => console.info('api listening at http://localhost:9000'));
