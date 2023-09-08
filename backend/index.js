const { OpenAPIBackend } = require('openapi-backend');
const express = require('express');
const { useAuth } = require('react-oidc-context');
const { google } = require('googleapis');
const cors = require('cors');
const postgres = require('postgres');
const key = require('./Private_key.json'); 
const RedisStore = require('connect-redis').default
const addFormats = require('ajv-formats');
const session = require('express-session');
const { createClient } = require('redis');
const cookieParser = require('cookie-parser');
const Ajv = require('ajv');
const MailComposer = require('nodemailer/lib/mail-composer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs')


const service = 'service-account@sodium-bliss-395109.iam.gserviceaccount.com'
const ajv = new Ajv()

addFormats(ajv)
const sql = postgres('postgres://postgres:hahaha@127.0.0.1:8080/rat')


const app = express();
app.use(express.json({ limit: '2mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '2mb', extended: true })); // Adjust the limit as needed
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

let redisClient = createClient()
redisClient.connect().catch(console.error)

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "SessionStore:",
})

app.use(express.json());

app.set('trust proxy', 1)

app.use(express.static(path.join(__dirname + "public/uploads")))


app.use(
  cors({
    origin: ["http://localhost:3000",'http://10.0.2.16',"http://10.0.2.2:5554","http://10.0.2.2:5555","http://localhost","http://192.168.39.115:9000","http://localhost/"],
    methods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type, Authorization, credentials']
  })
);

app.use(session({
  name: 'info',
  secret: 'sexxx',
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge:360000000, path:'/', sameSite:'lax', httpOnly:true, secure:false},
}));





const jwtClient = new google.auth.JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/gmail.addons.current.action.compose', 'https://www.googleapis.com/auth/gmail.addons.current.message.action']
});




const gmail = google.gmail({
  version: 'v1',
})


// Functions for later use //



const api = new OpenAPIBackend({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Android',
      version: '1.0.0',
    },
    paths: {
      
      '/api/Test':{
      get: {
        operationId: 'Test2',
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
    '/api/mail':{
      get: {
        operationId: 'getUserMail',
        "parameters": [
          {
            "name": "pageToken",
            "in": "query",
            "description": "Token for pagination of results",
            "schema": {
              "type": "string"
            }
          }
        ],
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
      get:{
        operationId: 'Test',
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
    },
    '/api/user':{
      get: {
        operationId: 'getUserInfo',
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
    '/api/mail/content':{
      post: {
        operationId: 'getMailContent',
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
    '/api/send-email':{
      post: {
        operationId: 'sendMail',
        responses: {
          200: {description: 'ok',
        content: {
          'application/json': {}
        }}
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
        imageUrl:{ 
          type: 'string'
      }
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
    Test2: async (c,req,res ) => {
    
    },
    getUserInfo: async (c, req, res) => {
      const session = req.session.id
      
console.log('hello',session)

      if(!session){
        res.status(404).json({error:'no session found'})
      }  
      
      if(typeof session !== 'string')
       {
        console.log('invalid')
       return res.status(400).json({error: 'invalid sessionId'})
      }
      
      const sessionData = await redisClient.get(`SessionStore:${session}`)
      console.log('session:',sessionData)
      if (!sessionData) {
        return res.status(404).json({ error: 'Session data not found' });
      }

      if(typeof sessionData == null){
        return res.status(404).json({ error: 'Session data not found' });
      }
       const sessionObject = JSON.parse(sessionData)

      const userId= sessionObject.userId

console.log(userId)
      const userInfo = await sql`select * from accounts where id = ${userId}
      `

    console.log(userInfo)
 return res.status(200).json({userInfo});
      
    },
    Test: async (c, req, res) =>{
      const session = req.session.id
      const sessionData = await redisClient.get(`SessionStore:${session}`)
      const sessionObject = JSON.parse(sessionData)

      const userId= sessionObject.userId

      const tokenRecord  = await sql `select access_token from tokens where user_id=${userId}` 

      const token = tokenRecord[0].access_token; 
    const mailContent= await gmail.users.messages.get({
      userId: userId,
      id: '189f9bbbd8464bfe',
      headers: {
        Authorization: `Bearer ${token}`,
      },
     })

    console.log(mailContent)

    return res.status(200).json({success: 'good'})
    },
    storeData: async (c, req, res) => {

const currentTime = new Date();
     async function checkExpiredTokens(){
      const clearTokens = await sql `Delete From tokens where expires_at < ${currentTime}
      `
      return clearTokens
     }

      function calculateExpirationTime() {
        const expirationTime = new Date(currentTime.getTime() + 60 * 60 * 1000); 
      
        return expirationTime;
      }

      await checkExpiredTokens()


      const expirationTime = calculateExpirationTime();
      const token = req.body.authentication.accessToken
      const email = req.body.email
      const username = req.body.name
      const image= req.body.imageUrl
      const id = req.body.id

      const tokenCheck = await sql`select access_token from tokens where user_id=${id}`
      const userCheck = await sql`SELECT email, COUNT(*) AS count
      FROM accounts
      WHERE email = ${email}
      GROUP BY email`
      for (const user of userCheck) {
        if (user.count > 1) {
          const userCleanup = await sql`
            DELETE FROM accounts
            WHERE ctid IN (
              SELECT ctid
              FROM accounts
              WHERE email = ${user.email}
              OFFSET 1
            )
          `;
          console.log('Cleaned');
        }
      }
const sessionId = req.session.id

req.session.userId= id



const cookieValue = `info=${sessionId}; Path=/; HttpOnly; SameSite=None; Secure; maxAge=36000000`;

    if(tokenCheck.length >= 1 && userCheck.length >=1){
      console.log('found')
      if(req.cookies.info){  
        return res.status(200).json({success: 'user found '})
      }
      
      req.session.save(function (err) {
        if (err) return (err)
        console.log('session saved')
       return res.header('Set-Cookie', cookieValue).status(200).json({success: 'user found'});
       
      }) 
    }

    if (tokenCheck.length = 0 && userCheck.length >= 1){
      const storeOnlyToken = await sql`insert into tokens(access_token,expires_at,created_at,user_id) VALUES (${token},${expirationTime},now(),${id})
      `
console.log('duplicate')
      if(req.cookies.info){
        return res.status(200).json({success: 'user found and token stored'})
      }

      req.session.save(function (err) {
        if (err) return (err)
        console.log('session saved')
        return res.header('Set-Cookie', cookieValue).status(200).json({success: 'user found and token stored'})
      })       
    }

    if(userCheck.length >= 1){
      if(req.cookies.info){
        req.session.save(function (err) {
          if (err) return (err)
          console.log('session saved')
          return res.status(200).json({success: 'token and user data stored '})
        })       
  
      }

      const storeToken = await sql`insert into tokens(access_token,expires_at,created_at,user_id)  VALUES (${token},${expirationTime},now(),${id})
      `
      req.session.save(function (err) {
        if (err) return (err)
        
        console.log('session saved')
        return res.status(200).json({success: 'token and user data stored'})
      })   
    }

         
    },
    getUserMail: async (c, req, res) => {
      const session = req.session.id
      const { pageToken } = req.query
      const sessionData = await redisClient.get(`SessionStore:${session}`)

      const sessionObject = JSON.parse(sessionData)

      const id= sessionObject.userId
    console.log(id)


     const tokenRecord  = await sql `select access_token from tokens where user_id=${id}` 

     const token = tokenRecord[0].access_token; 

     console.log(token)
     const mailResponse= await gmail.users.messages.list({
      userId: id,
      maxResults: 10,
      pageToken: pageToken,
      labelIds: ['INBOX'],
      headers: {
        Authorization: `Bearer ${token}`,
      },
     })

    
     const messages = mailResponse.data.messages || [];
    const messageIds = messages.map(message => message.id);
    const nextPageToken = mailResponse.data.nextPageToken;
    console.log(messageIds)
   return res.status(200).json({messageIds, nextPageToken}); 

    },
    getMailContent: async (c, req, res) => {

      const mailData = req.body
      const mailId = mailData.emails

   
      const session = req.session.id
      const sessionData = await redisClient.get(`SessionStore:${session}`)
      const sessionObject = JSON.parse(sessionData)

      const id= sessionObject.userId
     

      const tokenRecord  = await sql `select access_token from tokens where user_id=${id}` 
      
      const token = tokenRecord[0].access_token; 
      
      const response= await gmail.users.messages.get({
        userId: id,
        id: mailId,
        format: 'METADATA',
        metadataHeaders: ['subject', 'date'],
        headers: {
          Authorization: `Bearer ${token}`,
        },
       })
       const snippet = response.data.snippet;
       const subjectHeader = response.data.payload.headers.find(header => header.name === 'Subject');
       const dateHeader = response.data.payload.headers.find(header => header.name === 'Date');
       
       const subject = subjectHeader ? subjectHeader.value : 'Subject not found';
       const date = dateHeader ? dateHeader.value : 'Date not found';
       
      
      const emailContent = {date, subject, snippet, mailId}
      console.log(emailContent)
       return res.status(200).json({emailContent})

    },
    sendMail: async (c, req,res) => {


      const attached = req.body.attachments

      const files = [];

      const saveBinaryDataToFile = (binaryData, fileExtension) => {
        const timestamp = Date.now();
        const filename = `${timestamp}.${fileExtension}`;
        const filePath = path.join(__dirname, 'uploads', filename); // Specify the full path to the file
        fs.writeFile(filePath, binaryData, 'binary', (err) => {
          if (err) {
            console.error('Error saving file:', err);
          } else {
            console.log(`File saved: ${filename}`);
            files.push({ path: filePath, filename });
            console.log(files);
          }
        });
      };
   

      for (const attachment of attached) {
        const filename = attachment.filename;
        const base64Data = attachment.data;
      
        // Decode the base64 data into binary
        const binaryData = Buffer.from(base64Data, 'base64');
       ;
      
        // Save the binary data to a file
        saveBinaryDataToFile(binaryData, filename);
      }

      const emailData = req.body


      const context = req.body.subject
      const emailContent = req.body.content
      const recipient = req.body.to
      const session = req.session.id
      const sessionData = await redisClient.get(`SessionStore:${session}`)
      const sessionObject = JSON.parse(sessionData)
const cc = req.body.cc
      const user= sessionObject.userId

      const userInfo = await sql`select * from accounts where id =${user} `

     const sender = userInfo.email

      const tokenRecord  = await sql `select access_token from tokens where user_id=${user}` 
      
      const token = tokenRecord[0].access_token; 
  
     


      const encodeMessage = (message) => {
        return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      };
      
      const createMail = async (options) => {
        const mailComposer = new MailComposer(options);
        const message = await mailComposer.compile().build();
        return encodeMessage(message);
      };
      
      const sendMail = async (options) => {
        
        const rawMessage = await createMail(options);
        const { data: { id } = {} } = await gmail.users.messages.send({
          userId: user,
          resource: {
            raw: rawMessage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return id;
      };
    
      
        const options = {
          to: recipient,
          cc: cc,
          subject: context,
          text: emailContent,
          html: emailContent,
          attachments: files,
          textEncoding: 'base64',
        };
      
        const messageId = await sendMail(options);
     console.log(messageId)
     return res.status(200).json({messageId: 'email sent'})
      
     


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
