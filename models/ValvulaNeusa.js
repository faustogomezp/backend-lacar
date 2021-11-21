const mongoose = require('mongoose')
const { Schema, model } = mongoose

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

  module.exports = ValvulaNeusa