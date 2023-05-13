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
    userId: {
        type: Sequelize.INTEGER
    }
    
});

module.exports = Member ; 