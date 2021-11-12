require('dotenv').config()
const { appConfig, db } = require('./config.js')
const connectDb = require('./db/connectDb.js')
const express = require('express')
const csv = require('csvtojson')
const fs = require('fs')
const cors = require('cors')
const mongoose = require('mongoose')
const { Schema, model } = mongoose
const userRouter = require('./controllers/users')
var jsonFile = {}

const app = express()
app.use(cors())

connectDb(db)


const LIST_DIRS = [
  '../../NEUSA/COMPUERTAS',
  '../../NEUSA/REGULADORA',
  '../../NEUSA/ELHATO2'
]

const LIST_DIRS_BACKUP = [
  '../../NEUSA/backupNeusaCompuertas',
  '../../NEUSA/backupNeusaValvula',
  '../../NEUSA/backupHatoAlumbrado',
]


const neusaCompuertasSchema = new Schema({
      __file: String,
      data: [{
        FECHA: Date,
        ENT1_FALLA_1: Number,
        ENT2_MAN_1: Number,
        ENT3_AUT_1: Number,
        ENT4_CERR_1: Number,
        ENT5_ABIER_1: Number,
        ENT6_FALLA_2: Number,
        ENT7_MAN_2: Number,
        ENT8_AUT_2: Number,
        ENT2_1_CERR_2HMI: Number,
        ENT2_2_ABIER_2HMI: Number,
        ENT2_3_FALL_3_HMI: Number,
        ENT2_4_MAN_3_HMI: Number,
        ENT2_5_AUTO_3_HMI: Number,
        ENT2_6_CERR_3_HMI: Number,
        ENT2_7_ABIER_3_HMI: Number
      }]
})
const CompuertasNeusa = model('CompuertasNeusa', neusaCompuertasSchema)

const valvNeusaSchema = new Schema ({
  __file: String,
  data: [{
        FECHA: Date,
        ZT_NEUSA: Number,
        LIT_NEUSA: Number,
        PIT_NEUSA: Number,
        FIT_NEUSA: Number,
        REM_REG: Number,
        LOC_REG: Number,
        MAN_CORTE_HMI: Number,
        LOC_CORTE: Number,
        REM_CORTE: Number,
        FALL_REG: Number,
        DISP_REG: Number,
        PIT_FALLA: Number,
        LIT_FALLA: Number,
        FIT_FALLA: Number,
        ZT_FALLA: Number,
        COMM_REG_FALLA: Number,
        ESD_SITIO: Number,
        AUTREGH1: Number,
        MANREGH1: Number,
        OPENEDRHM1: Number,
        CLOSEDRHM1: Number
      }]
})

const ValvulaNeusa = model('ValvulaNeusa', valvNeusaSchema)

const alumbradoHatoSchema = new Schema ({
  __file: String,
  data: [{
        FECHA: Date,
        ENTRADA_1_AUTO: Number,
        ENTRADA_2_AUTO: Number,
        ENTRADA_3_AUTO: Number,
        ENCENDIDO_1: Number,
        ENCENDIDO_2: Number,
        ENCENDIDO_3: Number,
      }]
})

const AlumbradoHato = model('AlumbradoHato', alumbradoHatoSchema)



const readDir = (dirName) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirName, (error, fileNames) => {
      if (error) {
        reject(error)
      } else {
        resolve(fileNames)
      }
    })
  })
}


const headersNeusa = [
  'FECHA',
  'ENT1_FALLA_1',
  'ENT2_MAN_1',
  'ENT3_AUT_1',
  'ENT4_CERR_1',
  'ENT5_ABIER_1',
  'ENT6_FALLA_2',
  'ENT7_MAN_2',
  'ENT8_AUT_2',
  'ENT2_1_CERR_2HMI',
  'ENT2_2_ABIER_2HMI',
  'ENT2_3_FALL_3_HMI',
  'ENT2_4_MAN_3_HMI',
  'ENT2_5_AUTO_3_HMI',
  'ENT2_6_CERR_3_HMI',
  'ENT2_7_ABIER_3_HMI'
]

const headersValvNeusa = [
  'FECHA',
  'ZT_NEUSA',
  'LIT_NEUSA',
  'PIT_NEUSA',
  'FIT_NEUSA',
  'REM_REG',
  'LOC_REG',
  'MAN_CORTE_HMI',
  'LOC_CORTE',
  'REM_CORTE',
  'FALL_REG',
  'DISP_REG',
  'PIT_FALLA',
  'LIT_FALLA',
  'FIT_FALLA',
  'ZT_FALLA',
  'COMM_REG_FALLA',
  'ESD_SITIO',
  'AUTREGH1',
  'MANREGH1',
  'OPENEDRHM1',
  'CLOSEDRHM1'
]

const headersIluminaria = [
  'FECHA',
  'ENTRADA_1_AUTO',
  'ENTRADA_2_AUTO',
  'ENTRADA_3_AUTO',
  'ENCENDIDO_1',
  'ENCENDIDO_2',
  'ENCENDIDO_3'
]

const saveData = () => {
  LIST_DIRS.map(dirName => {
    readDir(dirName)
      .then((filenames) => {
        // eslint-disable-next-line array-callback-return
        filenames.map((file) => {
          const nameLogger = dirName.split('/')[3]
          var headers = []
          var fieldDate = ''
          const data = fs.readFileSync(dirName + '/' + file, 'utf8')
          var newData = data.replace(/\t/g, 'T')
          newData = newData.replace('[%Y-%m-%d %H:%M:%S]', '').trim()
          if (nameLogger === 'COMPUERTAS') {
            newData = newData.replace('COMPUERTAS', '').trim()
            headers = headersNeusa
            fieldDate = 'ENT1_FALLA_1'
          } else if (nameLogger === 'REGULADORA') {
            newData = newData.replace('REGULADORA', '').trim()
            headers = headersValvNeusa
            fieldDate = 'ZT_NEUSA'
          } else if (nameLogger === 'ELHATO2') {
            newData = newData.replace('ALUMBRADO', '').trim()
            headers = headersIluminaria
            fieldDate = 'ENTRADA_1_AUTO'
          }
          csv({
            delimiter: ';',
            noheader: true,
            headers: headers
          })
          .fromString(newData)
              //.fromFile(file)
          .then((csvRow) => {
            jsonFile = {
              __file: file,
              data: csvRow.filter(element => element.FECHA !== fieldDate && element.FECHA !== '[%Y-%m-%dT%H:%M:%S]')
            }
            if (nameLogger === 'COMPUERTAS') {
              CompuertasNeusa.insertMany(jsonFile)
              .then(result => {
                console.log(file, 'Actualizado')
                fs.rename(dirName + '/' + file, LIST_DIRS_BACKUP[0] + '/' + file, (err) => {
                  if (err) console.log(err);
                })
              })
            } else if (nameLogger === 'REGULADORA') {
              ValvulaNeusa.insertMany(jsonFile)
              .then(result => {
                console.log(file, 'Actualizado')
                fs.rename(dirName + '/' + file, LIST_DIRS_BACKUP[1] + '/' + file, (err) => {
                  if (err) console.log(err);
                })
              })
            } else if (nameLogger === 'ELHATO2') {
              AlumbradoHato.insertMany(jsonFile)
              .then(result => {
                console.log(file, 'Actualizado')
                fs.rename(dirName + '/' + file, LIST_DIRS_BACKUP[2] + '/' + file, (err) => {
                  if (err) console.log(err);
                })
              })
            }
          })
        })
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

// eslint-disable-next-line array-callback-return
setInterval(() => {
  saveData()
  console.log('Cada 5 minutos')
}, appConfig.milSeconds)

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/variables/:logger', (request, response) => {
  const logger = request.params.logger
    //Organizarla del mayor al menor
    if (logger === 'compuertas') {
      CompuertasNeusa.find({})
      .then(result => {
        response.json(result)
      })
    } else if (logger === 'alumbrado') {
      AlumbradoHato.find({})
      .then(result => {
        response.json(result)
      })
    } else if (logger === 'valvula'){
      ValvulaNeusa.find({})
      .then(result => {
        response.json(result)
      })
    }
})

app.get('/api/variables/online/:logger', (request, response) => {
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

app.use('/api/users', userRouter)


app.listen(appConfig.port, () => {
  console.log(`Server running on port ${appConfig.port}`)
})
