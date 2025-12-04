import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express4'
import typeDefs from './schema/typeDefs.js'
import resolvers from './schema/resolvers.js'
import jwt from 'jsonwebtoken'
import User from './models/User.js'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import { checkFirstUser } from './utils/createFirstUser.js'

/*if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.development' })
}*/

dotenv.config()

const allowedOrigins = process.env.CORS_ORIGINS.split(',')

const app = express()
const server = new ApolloServer({ typeDefs, resolvers })
await server.start()

app.use(
  '/graphql',
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','apollo-require-preflight'],
    credentials: true
  }),
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization
      if (auth && auth.startsWith('Bearer ')) {
        try {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        } catch (err) {
          console.error('Virhe:', err.message)
        }
      }
      return {}
    },
  })
)

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`MongoDB connected`)
    checkFirstUser()
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`)
    })
  })
  .catch(err => console.error(err))