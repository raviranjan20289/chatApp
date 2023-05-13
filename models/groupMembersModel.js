const Sequelize = require('sequelize');
const sequelize = require('../utility/database');

const Member = sequelize.define('member',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    groupName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userName: {
        type: Sequelize.STRING
    },
    userId: {
        type: Sequelize.INTEGER
    },
    isAdmin: {
        type: Sequelize.BOOLEAN
    }

    
});

module.exports = Member ; 