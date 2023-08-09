import {OpenAPIBackend} from 'openapi-backend';;
import express from 'express';
import { useAuth } from 'react-oidc-context'; 
import { GoogleApis } from 'googleapis';
import cors from 'cors'

const google = new GoogleApis()

const app = express();
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  '48479698491-eggd5u6iebahkm5kakb9q81s9pme1j37.apps.googleusercontent.com',
  ' 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',
  'http://localhost:9000'
);


const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client
})
app.use(
  cors({
    origin: ["http://localhost:3000/login", "http://localhost:3000/home", "http://localhost:3000",],
    methods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type, Authorization, credentials']
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
      get:{
        operationId: 'getUserMail',
        responses:{
          200:{description:'ok', 
          content: {
            'application/json':{
            }
          }
        }
        }
      }
    },
    '/api/store/user':{
      post:{
        operationId: 'storeUser',
        requestBody: {
          content: {
            'application/json': {
            }
          }
        },
        responses: {
          200: {description: 'ok'}
        }
      }
    }
    },
  },
  handlers: {
    getUserMail: async (c, req, res) => {
      console.log(req.body)
      const {token} = req.body.token
      
      const user = await gmail.users.getProfile({
        userId: 'me',
        auth: oauth2Client
      })
      const userId = user.data.emailAddress;
      console.log('gmail User ID:', userId)
      return res.status(200).json(user)
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
