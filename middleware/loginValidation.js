const jwt = require('jsonwebtoken')
const {appConfig } = require('../config.js')

module.exports = (request, response, next) => {
    const authorization = request.get('authorization')

    let token = null
    let decodedToken = null
    if (authorization && authorization.toLowerCase().startsWith('bearer')) { 
      token = authorization.substring(7)
      decodedToken = jwt.verify(token, appConfig.ws)
    }  
  
    if (!token || !decodedToken.id) {
      return response.status(401).json( {error: 'token missing or invalid'})
    }

    const { username } = decodedToken

    request.username = username
    
    next()
  
}