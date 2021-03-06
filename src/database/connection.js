const Sequelize = require('sequelize')
const db = {}
const sequelize = new Sequelize('dumbgram', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
    freezeTableName: true,

    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
})

db.sequelize = sequelize

module.exports = db