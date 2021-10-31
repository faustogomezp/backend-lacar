const express = require('express')
const csv = require('csvtojson')
const fs = require('fs')
const cors = require('cors')
const mongoose = require('mongoose')
const { Schema, model } = mongoose
var jsonFile = {}

const app = express()
app.use(cors())
/* const connectionString = 'mongodb://localhost:27017/lacar' */
const password = 'DBQMi6Tasla7u07k'
const connectionString = `mongodb+srv://fgomezp:${password}@cluster0.hrihp.mongodb.net/lacar?retryWrites=true&w=majority`

const LIST_DIRS = [
  './files/neusa_compuertas',
  './files/neusa_valv',
  './files/hato_alumbrado'
]

const LIST_DIRS_BACKUP = [
  './files/backupNeusaCompuertas',
  './files/backupNeusaValvula',
  './files/backupHatoAlumbrado',
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
        LIT_NEUSA: Number,
        PIT_NEUSA: Number,
        FIT_NEUSA: Number,
        ZT_NEUSA: Number,
        AUT_REG_HMI: Number,
        MAN_REG_HMI: Number,
        OPENED_REG: Number,
        CLOSED_REG: Number,
        LIT_NEUSA: Number,
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
        ESD_SITIO: Number
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
  'LIT_NEUSA',
  'PIT_NEUSA',
  'FIT_NEUSA',
  'ZT_NEUSA',
  'AUT_REG_HMI',
  'MAN_REG_HMI',
  'OPENED_REG',
  'CLOSED_REG',
  'LIT_NEUSA',
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
  'ESD_SITIO'
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



// eslint-disable-next-line array-callback-return
setInterval(() => {

  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=> {
      console.log('Database connected')
      LIST_DIRS.map(dirName => {
        readDir(dirName)
          .then((filenames) => {
            // eslint-disable-next-line array-callback-return
            filenames.map((file) => {
              const nameLogger = dirName.split('/')[2]
              var headers = []
              var fieldDate = ''
              const data = fs.readFileSync(dirName + '/' + file, 'utf8')
              var newData = data.replace(/\t/g, 'T')
              newData = newData.replace('[%Y-%m-%d %H:%M:%S]', '').trim()
              if (nameLogger === 'neusa_compuertas') {
                newData = newData.replace('COMPUERTAS', '').trim()
                headers = headersNeusa
                fieldDate = 'ENT1_FALLA_1'
              } else if (nameLogger === 'neusa_valv') {
                newData = newData.replace('VALVULA_NEUSA', '').trim()
                headers = headersValvNeusa
                fieldDate = 'LIT_NEUSA'
              } else {
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
                if (nameLogger === 'neusa_compuertas') {
                  CompuertasNeusa.insertMany(jsonFile)
                  .then(result => {
                    console.log(file, 'Actualizado')
                    fs.rename(dirName + '/' + file, LIST_DIRS_BACKUP[0] + '/' + file, (err) => {
                      if (err) throw err;
                    })
                  })
                } else if (nameLogger === 'neusa_valv') {
                  console.log(jsonFile)
                  ValvulaNeusa.insertMany(jsonFile)
                  .then(result => {
                    console.log(file, 'Actualizado')
                    fs.rename(dirName + '/' + file, LIST_DIRS_BACKUP[1] + '/' + file, (err) => {
                      if (err) throw err;
                    })
                  })
                } else {
                  console.log(jsonFile)
                  AlumbradoHato.insertMany(jsonFile)
                  .then(result => {
                    console.log(file, 'Actualizado')
                    fs.rename(dirName + '/' + file, LIST_DIRS_BACKUP[2] + '/' + file, (err) => {
                      if (err) throw err;
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
    setTimeout(() => {
      mongoose.connection.close()
      console.log('BD connection is closed')
    }, 10000);
  })
  .catch(err => {
      console.log(err)
  })
    
  console.log('Cada 5 minutos')
}, 300000)

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/variables/:logger', (request, response) => {
  mongoose.connect(connectionString)
  .then(() => {
    //Organizarla del mayor al menor
    CompuertasNeusa.find({})
    .then(result => {
      response.json(result)
      mongoose.connection.close()
    })
  })
  .catch(err => {
    response.send('Not connected to db, Try soo')
  })

})

app.get('/api/variables/online/:logger', (request, response) => {
  const logger = request.params.logger
  mongoose.connect(connectionString)
  .then(() => {
    if (logger === 'logger0'){
      LoggerZero.find({}, {'_id': 1}).sort({$natural:-1}).limit(1)
      .then(result => {
        if (result){
          const lastId = result[0]._id
          console.log(typeof(lastId), lastId)
        }
        response.json(result)
        mongoose.connection.close()
      })
    }
  })
  .catch(err => {
    response.send('Not connected to db, Try again')
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
