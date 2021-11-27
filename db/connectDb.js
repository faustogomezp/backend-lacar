const mongoose = require('mongoose')

async function connectDb ({ host, port, dbName, username, password }) {
    const uri = `mongodb://${host}:${port}/${dbName}`
    

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: username,
        pass: password
    }

    await mongoose.connect(uri, options)
      .then(()=> {
        console.log("Db connected")
      })
      .catch(err => {
          console.log(err)
      })
}

module.exports = connectDb

