const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const handlers = require('./handlers')

app.get('/', (req, res) => res.send('Nothing here'))

app.get('/candidato', handlers.candidato)

app.get('/lista-candidatos', handlers.listaCandidatos)

const url = 'mongodb://localhost:27017'
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  assert.equal(null, err)
  app.locals.db = client.db('eleicoes')
  app.listen(3000, () => console.log('App listening on port 3000!'))
})
