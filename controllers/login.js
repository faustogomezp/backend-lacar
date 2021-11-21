const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { appConfig } = require('../config.js')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
    const { body } = request
    const { username, password } = body

    const user = await User.findOne({ username })

    if (!user) {
        response.status(401).json({
            error: "Invalid user or password"
        })
    }

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        response.status(401).json({
            error: 'Invalid user or password'
        })
    }

    const userForToken = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(userForToken, 'D$qM%6Tisla7u07kn')

    response.send({
        name: user.name,
        username: user.username,
        token
    })


})

module.exports = loginRouter