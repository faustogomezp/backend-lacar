const config = {
    'appConfig': {
        'port': process.env.PORT,
        'milSeconds': 300000 //Milisegundos para actualizar datos
    },
    'db': {
        'host': process.env.DB_HOST,
        'port': process.env.DB_PORT,
        'username': process.env.DB_USERNAME,
        'password': process.env.DB_PWD,
        'dbName': process.env.DB_NAME,
    }
}

module.exports = config

