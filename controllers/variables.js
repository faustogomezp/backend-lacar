const { appConfig } = require('../config.js')
const variablesRouter = require('express').Router()


const CompuertasNeusa = require('../models/CompuertasNeusa')
const ValvulaNeusa = require('../models/ValvulaNeusa')
const AlumbradoHato = require('../models/AlumbradoHato')

variablesRouter.get('/online/:logger', (request, response) => {
    const logger = request.params.logger
  
      if (logger === 'compuertas') {
        CompuertasNeusa.find({}).sort({$natural:-1}).limit(1)
        .then(result => {
          if (result){
            const lastId = result[0].data[result[0].data.length-1]
            response.json(lastId)
          }
        })
      } else if (logger === 'alumbrado') {
        AlumbradoHato.find({}).sort({$natural:-1}).limit(1)
        .then(result => {
          if (result){
            const lastId = result[0].data[result[0].data.length-1]
            response.json(lastId)
          }
        })
      } else if (logger === 'valvula') {
        ValvulaNeusa.find({}).sort({$natural:-1}).limit(1)
        .then(result => {
          if (result){
            const lastId = result[0].data[result[0].data.length-1]
            response.json(lastId)
          }
        })
      }
  })

  variablesRouter.post('/:logger', (request, response) => {
    const logger = request.params.logger
    const {body} = request
    const {dateIni, dateFin} = body
    if (dateFin !== null && dateIni !== null){
      console.log(dateIni, dateFin)
      //Organizarla del mayor al menor
      if (logger === 'compuertas') {
        CompuertasNeusa.find({data: {$elemMatch: {
          $and: [
          {FECHA: {$gte: new Date(dateIni)}},
          {FECHA: {$lte: new Date(dateFin)}}
          ]} }})
        .then(result => {
          response.json(result)
        })
      } else if (logger === 'alumbrado') {
        AlumbradoHato.find({data: {$elemMatch: {
          $and: [
            {FECHA: {$gte: new Date(dateIni)}},
            {FECHA: {$lte: new Date(dateFin)}}
            ]} }})
        .then(result => {
          response.json(result)
        })
      } else if (logger === 'valvula'){
        ValvulaNeusa.find({data: {$elemMatch: {
          $and: [
            {FECHA: {$gte: new Date(dateIni)}},
            {FECHA: {$lte: new Date(dateFin)}}
            ]} }})
        .then(result => {
          response.json(result)
        })
      }
    }
  })

  module.exports = variablesRouter