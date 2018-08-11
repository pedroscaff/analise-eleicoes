#!/usr/bin/env bash

mkdir -p data
cd data

curl http://agencia.tse.jus.br/estatistica/sead/odsele/consulta_vagas/consulta_vagas_2014.zip -L -O
curl http://agencia.tse.jus.br/estatistica/sead/odsele/consulta_legendas/consulta_legendas_2014.zip -L -O
curl http://agencia.tse.jus.br/estatistica/sead/odsele/bem_candidato/bem_candidato_2014.zip -L -O
curl http://agencia.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_2014.zip -L -O

unzip consulta_vagas_2014.zip -d consulta_vagas_2014
unzip consulta_legendas_2014.zip -d consulta_legendas_2014
unzip bem_candidato_2014.zip -d bem_candidato_2014
unzip consulta_cand_2014.zip -d consulta_cand_2014