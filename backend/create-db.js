const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')
const colors = require('colors')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const {
  HEADERS_BEM_CANDIDATO,
  HEADERS_CONSULTA_CANDIDATO
} = require('./headers')

function createBensDB (collection) {
  return new Promise((resolve, reject) => {
    const filepath = path.resolve(
      `./data/bem_candidato_2014/bem_candidato_2014_${ 'RJ' }.txt`
    )
    const stream = fs.createReadStream(filepath)
    const parsedData = {}
    const csvStream = csv
      .parse({
        delimiter: ';',
        headers: HEADERS_BEM_CANDIDATO
      })
      .on('data', data => {
        data['VALOR_BEM'] = +data['VALOR_BEM']
        data['CD_TIPO_BEM_CANDIDATO'] = +data['CD_TIPO_BEM_CANDIDATO']
        data['ANO_ELEICAO'] = +data['ANO_ELEICAO']
        const id = data['SQ_CANDIDATO']
        if (!parsedData[id]) {
          parsedData[id] = {}
          parsedData[id]._id = id
          parsedData[id].bens = []
        }
        parsedData[id].bens.push(data)
      })
      .on('end', () => {
        collection.drop(() => {
          const data = []
          Object.keys(parsedData).forEach(key => data.push(parsedData[key]))
          collection.insertMany(data)
          .then(res => {
            assert.equal(res.insertedCount, data.length)
            console.log(colors.green('created bens collection'))
            resolve()
          })
          .catch(reject)
        })
      })

    stream.pipe(csvStream)
  })
}

function createCandidatosDB (collection) {
  return new Promise((resolve, reject) => {
    const filepath = path.resolve(
      `./data/consulta_cand_2014/consulta_cand_2014_${ 'RJ' }.txt`
    )
    const stream = fs.createReadStream(filepath)
    const parsedData = []
    const csvStream = csv
      .parse({
        delimiter: ';',
        headers: HEADERS_CONSULTA_CANDIDATO
      })
      .on('data', data => {
        data._id = data['SQ_CANDIDATO']
        data['CODIGO_CARGO'] = +data['CODIGO_CARGO']
        data['NUMERO_PARTIDO'] = +data['NUMERO_PARTIDO']
        parsedData.push(data)
      })
      .on('end', () => {
        collection.drop(() => {
          collection.insertMany(parsedData)
          .then(res => {
            assert.equal(res.insertedCount, parsedData.length)
            console.log(colors.green('created candidatos collection'))
            resolve()
          })
          .catch(reject)
        })
      })

    stream.pipe(csvStream)
  })
}

const url = 'mongodb://localhost:27017'
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  assert.equal(null, err)
  const db = client.db('eleicoes')
  Promise.all([
    createBensDB(db.collection('bens-candidatos-rj')),
    createCandidatosDB(db.collection('candidatos-rj'))
  ]).then(() => {
    console.log(colors.green.bold('databased is up and running!'))
    client.close()
  }).catch(err => {
    console.log('could not create db', err)
    client.close()
  })
})
