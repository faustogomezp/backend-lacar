const mongoose = require('mongoose')

function connectDb ({ host, port, dbName, username, password }) {
    const uri = `mongodb://${host}:${port}/admin`
    
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: username,
        pass: password
    }

    mongoose.connect(uri, options)
      .then(()=> {
        console.log("Db connected")
        mongoose.connection.useDb(dbName)
      })
      .catch(err => {
          console.log(err)
      })
}

module.exports = connectDb

