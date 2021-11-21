const mongoose = require('mongoose')
const { Schema, model } = mongoose

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

  module.exports = AlumbradoHato