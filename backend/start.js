// const express = require('express')
// const app = express()
const { GraphQLServer } = require('graphql-yoga')
const MongoClient = require('mongodb').MongoClient

const handlers = require('./handlers')

// app.get('/', (req, res) => res.send('Nothing here'))

// app.get('/candidato', handlers.candidato)

// app.get('/lista-candidatos', handlers.listaCandidatos)

const url = 'mongodb://localhost:27017/'

module.exports = async () => {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
    db = client.db('eleicoes')
    const resolvers = {
      Query: {
        candidato: (root, args) => handlers.candidato(root, args, db),
        candidatos: (root, args, context, info) => handlers.listaCandidatos(root, args, context, info, db)
      }
    }

    const server = new GraphQLServer({
      typeDefs: './backend/schema.graphql',
      resolvers,
    })
    server.start(() => console.log(`Server is running on http://localhost:4000`))
  } catch (e) {
    console.log(e)
  }  
}
