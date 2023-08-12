import {OpenAPIBackend} from 'openapi-backend';;
import express from 'express';
import { useAuth } from 'react-oidc-context'; 
import { GoogleApis } from 'googleapis';
import cors from 'cors'
import postgres from 'postgres';
import key from './Private_key.json' assert { type: "json" }



const service = 'service-account@sodium-bliss-395109.iam.gserviceaccount.com'
const sql = postgres('postgres://postgres:hahaha@127.0.0.1:8080/rat')
const google = new GoogleApis()

const app = express();
app.use(express.json());

const jwtClient = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/gmail.addons.current.action.compose', 'https://www.googleapis.com/auth/gmail.addons.current.message.action']
}

);


const gmail = google.gmail({
  version: 'v1',
  auth: jwtClient
})
app.use(
  cors({
    origin: ["http://localhost:3000/login", "http://localhost:3000/Home", "http://localhost:3000",],
    methods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'credentials']
  })
);


const api = new OpenAPIBackend({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Android',
      version: '1.0.0',
    },
    paths: {
    '/api/mail':{
      get: {
        operationId: 'getUserMail',
        responses: {
          200: {description: 'ok',
        content: {
          'application/json':{
            schema: {
              $ref: '#/components/schemas/Users'
            }
          }
        }}
        },

      }
    },
    '/api/store/user':{
      post:{
        operationId: 'storeUser',
        responses: {
          200: {description: 'ok'}
        },
        requestBody: {
          content: {
            'application/json': {
            }            
          }
        },

      }
    },
    '/api/store/token':{
      post:{
        operationId: 'storeToken',
        responses: {
          200: {description: 'ok'}
        },
        requestBody:{
          content: {
            'application/json': {
            }
          }
        }
      }
    }
    },
    components:{
    schemas: {
      Users: {
        type: 'object',
        properties: {
          username:{
            type: 'string',
          },
          password: {
            type: 'string',
        },
        created_on: {
          type:'string',
        },
        email:{ 
          type: 'string',
        },
        },

      },
     Token: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
        },
        access_token: {
          type: 'string',
        },
        expires_at: {
          type: 'string',
        },
        created_at: {
          type: 'string',
        }
      }
     }
    }
  }
    
  },
  handlers: {
    getUserMail: async (c, req, res) => {
      console.log(req)
      
      const user = await gmail.users.messages.list({
        userId: 'me',
      })
      const emails = user.data.messages;
      console.log('gmail:', emails)
      return res.status(200).json(emails)
    },
    Test: async (c, req, res) =>{
    const test = await sql`SELECT * FROM accounts;`
    console.log(test)
    return res.status(200).json(test)
    },
    storeToken: async (c, req, res) => {
      console.log(req.body)
      const token = req.requestBody

      const store = hi

    },
    validationFail: async (c, req, res) => res.status(400).json({ err: c.validation.errors }),
    notFound: async (c, req, res) => res.status(404).json({ err: 'not found' }),

  },

});


api.init();

// use as express middleware
app.use((req, res) => api.handleRequest(req, req, res));

// start server
app.listen(9000, () => console.info('api listening at http://localhost:9000'));
