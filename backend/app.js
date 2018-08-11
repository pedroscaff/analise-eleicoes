const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

const handlers = require('./handlers')

app.get('/bens-candidato', handlers.bensCandidato)

app.get('/lista-candidatos', handlers.listaCandidatos)