const { LIST_DIRS, LIST_DIRS_BACKUP } = require('../config.js')
const csv = require('csvtojson')
const fs = require('fs')
const CompuertasNeusa = require('../models/CompuertasNeusa')
const ValvulaNeusa = require('../models/ValvulaNeusa')
const AlumbradoHato = require('../models/AlumbradoHato')
var jsonFile = {}

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
            } else if (nameLogger === 'ELHATOAL_') {
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
              } else if (nameLogger === 'ELHATOAL_') {
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

  module.exports = saveData