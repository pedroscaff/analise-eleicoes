const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')

const {
  HEADERS_BEM_CANDIDATO,
  HEADERS_CONSULTA_CANDIDATO
} = require('./headers')

module.exports = {
  candidato: (req, res) => {
    if (!req.query.id || !req.query.uf) {
      res.status(400).send('Bad Request, id and uf params required')
    }
    const { id, uf } = req.query
    const db = req.app.locals.db
    db.collection(`bens-candidatos-${ uf.toLowerCase() }`).find({
      _id: id
    }).toArray((err, arr) => {
      if (err) {
        res.status(500).send(err.Message)
      }
      res.json(arr)
    })
  },
  listaCandidatos: (req, res) => {
    if (!req.query.cargo || !req.query.uf) {
      res.status(400).send('Bad Request, cargo and uf params required')
    }
    const { cargo, uf, partido } = req.query
    const db = req.app.locals.db
    db.collection(`candidatos-${ uf.toLowerCase() }`).find({
      CODIGO_CARGO: +cargo,
      NUMERO_PARTIDO: +partido
    }).toArray((err, arr) => {
      if (err) {
        res.status(500).send(err.Message)
      }
      res.json(arr)
    })
  }
}