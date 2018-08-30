const fs = require('fs')
const path = require('path')
const csv = require('fast-csv')
const getFieldNames = require('graphql-list-fields')

const {
  HEADERS_BEM_CANDIDATO,
  HEADERS_CONSULTA_CANDIDATO
} = require('./headers')

const getBensCandidato = async (id, uf, db) => {
  const result = await db.collection(`bens-candidatos-${ uf.toLowerCase() }`).find({
    _id: id
  }).toArray()
  return result[0] && result[0].bens
}

const getInfoCandidato = async (query, uf, db) => {
  return await db.collection(`candidatos-${ uf.toLowerCase() }`).find(query).toArray()
}

module.exports = {
  candidato: async (root, args, db) => {
    const { id, uf } = args
    const infoCandidato = getInfoCandidato({
      _id: id
    }, uf, db)
    const bens = getBensCandidato(id, uf, db)

    return await Promise.all([infoCandidato, bens]).then(values => {
      const candidato = values[0][0]
      candidato.bens = values[1]
      return candidato
    })
  },
  listaCandidatos: async (root, args, context, info, db) => {
    const { cargo, uf, partido } = args
    const fields = getFieldNames(info)
    const generalQuery = {
      CODIGO_CARGO: cargo
    }
    if (partido) {
      generalQuery.NUMERO_PARTIDO = partido
    }
    const infoCandidato = await getInfoCandidato(generalQuery, uf, db)
    const requestBens = fields.filter(field => field.includes('bens')).length > 0
    if (requestBens) {
      infoCandidato.forEach(candidato => {
        candidato.bens = getBensCandidato(candidato._id, uf, db)
      })
    }
    return infoCandidato
  }
}