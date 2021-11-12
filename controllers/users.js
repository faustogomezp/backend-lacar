const userRouter = require('express').Router()
const User = require('../models/User.js')

userRouter.post('/', async ( request, response) => {
    const {body} = request
    console.log(request)
    const { username, name, password} = body
    console.log("Aqui estoy")
    const user = new User({
        username,
        name, 
        passwordHash: password
    });

    const savedUser = await user.save();

    response.json(savedUser)

})

module.exports = userRouter