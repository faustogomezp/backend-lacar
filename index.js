require('dotenv').config()
const { appConfig, db } = require('./config.js')
const connectDb = require('./db/connectDb.js')
const express = require('express')

const cors = require('cors')
const mongoose = require('mongoose')

const saveData = require('./controllers/saveData')
const loginValidation = require('./middleware/loginValidation')

const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const variablesRouter = require('./controllers/variables')


const app = express()
app.use(express.json())
app.use(cors())

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