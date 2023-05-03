const Sequelize = require('sequelize')

const sequelize = new Sequelize('chatapp','root','connectnode',{
    dialect:'mysql',
    host: 'localhost'
})

module.exports = sequelize ;