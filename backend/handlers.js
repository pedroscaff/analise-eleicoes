const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')

const {
  HEADERS_BEM_CANDIDATO,
  HEADERS_CONSULTA_CANDIDATO
} = require('./headers')

module.exports = {
  bensCandidato: (req, res) => {
    if (!req.query.id || !req.query.uf) {
      res.status(400).send('Bad Request, id and uf params required')
    }
    const { id, uf } = req.query
    const filepath = path.resolve(
      `./data/bem_candidato_2014/bem_candidato_2014_${uf.toUpperCase()}.txt`
    )
    const stream = fs.createReadStream(filepath)
    const parsedData = []
    const csvStream = csv
      .parse({
        delimiter: ';',
        headers: HEADERS_BEM_CANDIDATO
      })
      .on('data', data => {
        if (data['SQ_CANDIDATO'] === id) {
          data['VALOR_BEM'] = +data['VALOR_BEM']
          parsedData.push(data)
        }
      })
      .on('end', () => {
        res.json({ result: parsedData })
      })

    stream.pipe(csvStream)
  },
  listaCandidatos: (req, res) => {
    if (!req.query.cargo || !req.query.uf) {
      res.status(400).send('Bad Request, cargo and uf params required')
    }
    const { cargo, uf } = req.query
    const filepath = path.resolve(
      `./data/consulta_cand_2014/consulta_cand_2014_${uf.toUpperCase()}.txt`
    )
    const stream = fs.createReadStream(filepath)
    const parsedData = []
    const csvStream = csv
      .parse({
        delimiter: ';',
        headers: HEADERS_CONSULTA_CANDIDATO
      })
      .on('data', data => {
        if (data['CODIGO_CARGO'] === cargo) {
          parsedData.push(data)
        }
      })
      .on('end', () => {
        res.json({ result: parsedData })
      })

    stream.pipe(csvStream)
  }
}