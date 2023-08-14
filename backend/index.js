import {OpenAPIBackend} from 'openapi-backend';;
import express from 'express';
import { useAuth } from 'react-oidc-context'; 
import { GoogleApis } from 'googleapis';
import cors from 'cors'
import postgres from 'postgres';
import key from './Private_key.json' assert { type: "json" }
import RedisStore from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';
const service = 'service-account@sodium-bliss-395109.iam.gserviceaccount.com'

const sql = postgres('postgres://postgres:hahaha@127.0.0.1:8080/rat')
const google = new GoogleApis()

const app = express();
app.use(express.json());

let redisClient = createClient()
redisClient.connect().catch(console.error)

const jwtClient = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/gmail.addons.current.action.compose', 'https://www.googleapis.com/auth/gmail.addons.current.message.action']
});


let redisStore = new RedisStore({
  client: redisClient,
  prefix: "SessionStore:",
})


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
app.set('trust proxy', 1)

app.use(session({
  name: 'info',
  store: redisStore,
  secret: 'sexxx',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge:360000000, path:'/', sameSite:'lax', httpOnly:true, secure: false},
}));


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
    '/api/store':{
      post:{
        operationId: 'storeData',
        responses: {
          200: {description: 'gamertime'}
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

      const id = await sql`
      `
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
    storeData: async (c, req, res) => {

     console.log('hit')

     async function checkExpiredTokens(){
      const currentTime= new Date()
      const clearTokens = await sql `Delete From tokens where expires_at < ${currentTime}
      `
     }

      function calculateExpirationTime() {
        const currentTime = new Date();
        const expirationTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Adding 60 minutes in milliseconds
      
        return expirationTime;
      }
console.log(req.session.id)
      const expirationTime = calculateExpirationTime();
      const token = req.body.authentication.accessToken
      const email = req.body.email
      const username = req.body.name
      const image= req.body.imageUrl
      const id = req.body.id

    const tokenCheck = await sql`select access_token from tokens where user_id=${id}`
    const userCheck = await sql`select email from accounts where email=${email}`

    if(tokenCheck && userCheck){
      return res.status(200).json({success: 'user found '})
    }

    if (!tokenCheck && userCheck){
      const storeOnlyToken = await sql`insert into tokens(access_token,expires_at,created_at,user_id) m qwv 1  VALUES (${token},${expirationTime},now(),${id})
      `
      return res.status(200).json({success: 'user found and token stored'})
    }
      const storeToken = await sql`insert into tokens(access_token,expires_at,created_at,user_id)  VALUES (${token},${expirationTime},now(),${id})
      `
      const storeUser = await sql`insert into accounts(username,created_on,email,id,image_url) VALUES (${username},now(),${email},${id},${image})
      `
      req.session.userEmail = email
      res.send('User email stored in session')
      
     return res.status(200).json({success: 'token and user data stored'})
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
