const config = {
    'appConfig': {
        'port': process.env.PORT,
        'milSecondsUpdate': process.env.MIL_SECONDS_UPDATE, //Milisegundos para actualizar datos,
        'ws': process.env.WS
    },
    'db': {
        'host': process.env.DB_HOST,
        'port': process.env.DB_PORT,
        'username': process.env.DB_USERNAME,
        'password': process.env.DB_PWD,
        'dbName': process.env.DB_NAME,
    },
    'LIST_DIRS': [
        process.env.DIR_NEUSA_COMPUERTAS,
        process.env.DIR_NEUSA_REGULADORA,
        process.env.DIR_ELHATO_ALUMBRADO
      ],
    'LIST_DIRS_BACKUP': [
        process.env.DIR_BACKUP_NC,
        process.env.DIR_BACKUP_NR,
        process.env.DIR_BACKUP_EHA,
      ]
}

module.exports = config

