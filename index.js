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
  './files/logger1',
  './files/logger2'
]


mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> {
    console.log('Database connected')
})
.catch(err => {
    console.log(err)
})

const neusaCompuertasSchema = new Schema({
      __file: String,
      data: [{
        FECHA: Date,
        ENT1_FALLA_1: Number,
        ENT3_AUT_1: Number,
        ENT4_CERR_1: Number,
        ENT5_ABIER_1: Number,
        ENT5_ABIER_1: Number,
        ENT6_FALLA_2: Number,
        ENT8_AUT_2: Number,
        ENT2_1_CERR_2HMI: Number,
        ENT2_2_ABIER_2HMI: Number,
        ENT2_3_FALL_3: Number,
        ENT2_5_AUTO_3: Number,
        ENT2_6_CERR_3: Number,
        ENT2_7_ABIER_3: Number
      }]
})
const CompuertasNeusa = model('CompuertasNeusa', neusaCompuertasSchema)


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
  'ENT3_AUT_1',
  'ENT4_CERR_1',
  'ENT5_ABIER_1',
  'ENT6_FALLA_2',
  'ENT8_AUT_2',
  'ENT2_1_CERR_2HMI',
  'ENT2_2_ABIER_2HMI',
  'ENT2_3_FALL_3',
  'ENT2_5_AUTO_3',
  'ENT2_6_CERR_3',
  'ENT2_7_ABIER_3'
]

const headersIluminaria = [
  'fecha',
  'variable_1',
  'variable_2',
  'variable_3',
  'variable_4'
]

// eslint-disable-next-line array-callback-return
LIST_DIRS.map(dirName => {
  readDir(dirName)
    .then((filenames) => {
      // eslint-disable-next-line array-callback-return
      filenames.map((file) => {
        const nameLogger = dirName.split('/')[2]
        var headers = []
        const data = fs.readFileSync(dirName + '/' + file, 'utf8')
        var newData = data.replace(/\t/g, 'T')
        newData = newData.replace('VALVULAS_COMPUERTAS', '').trim()
        newData = newData.replace('[%Y-%m-%d %H:%M:%S];', '').trim()
        newData = newData.replace('[];', '').trim()
        if (nameLogger === 'neusa_compuertas') {
            headers = headersNeusa
        } else if (nameLogger === 'logger1') {
            headers = headersIluminaria
        } else {
            headers = headersIluminaria
        }
        csv({
          delimiter: ';',
          noheader: true,
          headers: headers
        })
          .fromString(newData)
          .fromFile(file)
          .then((csvRow) => {
            jsonFile = {}
            jsonFile = {
              __file: file,
              data: csvRow.filter(element => element.ENT1_FALLA_1 !== 'ENT3_AUT_1' &&  element.ENT1_FALLA_1 !== '[]')
            }
            if (nameLogger === 'neusa_compuertas') {
              CompuertasNeusa.insertMany(jsonFile)
                .then(result => {
                  mongoose.connection.close()
                })
                .catch(err => {
                })
            }
          })
      })
    })
    .catch((err) => {
      console.log(err)
    })
})





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
