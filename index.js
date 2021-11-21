require('dotenv').config()
const { appConfig, db } = require('./config.js')
const connectDb = require('./db/connectDb.js')
const express = require('express')

const cors = require('cors')
const mongoose = require('mongoose')
<<<<<<< HEAD
const { Schema, model } = mongoose
var jsonFile = {}

const app = express()
app.use(cors())
/* const connectionString = 'mongodb://localhost:27017/lacar' */
const password = 'DBQMi6Tasla7u07k'
const connectionString = `mongodb+srv://fgomezp:${password}@cluster0.hrihp.mongodb.net/lacar?retryWrites=true&w=majority`

const LIST_DIRS = [
  '../../NEUSA/COMPUERTAS',
  '../../NEUSA/REGULADORA',
  '../../NEUSA/ELHATOAL'
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

=======
const saveData = require('./controllers/saveData')
const loginValidation = require('./middleware/loginValidation')
>>>>>>> app-modular

const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const variablesRouter = require('./controllers/variables')


const app = express()
app.use(express.json())
app.use(cors())

<<<<<<< HEAD
const saveData = () => {
  console.log('Save Data')
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
          } else if (nameLogger === 'ELHATOAL') {
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
              console.log(jsonFile)
              ValvulaNeusa.insertMany(jsonFile)
              .then(result => {
                console.log(file, 'Actualizado')
                fs.rename(dirName + '/' + file, LIST_DIRS_BACKUP[1] + '/' + file, (err) => {
                  if (err) console.log(err);
                })
              })
            } else if (nameLogger === 'ELHATOAL') {
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
=======
>>>>>>> app-modular

connectDb(db)
.then(() => {
  saveData()
})

// eslint-disable-next-line array-callback-return
setInterval(() => {
  saveData()
  console.log('Cada 5 minutos')
}, appConfig.milSecondsUpdate)

app.get('/', loginValidation, (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.use('/api/variables',loginValidation, variablesRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)


app.listen(appConfig.port, () => {
  console.log(`Server running on port ${appConfig.port}`)
})