const mongoose = require('mongoose')
const { Schema, model } = mongoose

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

module.exports = CompuertasNeusa
