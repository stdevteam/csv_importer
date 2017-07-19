var env = "dev";
var config = require('../database.json')[env];
var Sequelize = require('sequelize');
var DataTypes = require("sequelize");
var useTransaction = require('sequelize-transactions');

// initialize database connection
var sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        host: 'localhost',
        dialect: 'mysql',
        port: '3306'
    }
);
useTransaction(sequelize);
var User = sequelize.define('users', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    job_title: DataTypes.STRING,
    department: DataTypes.STRING,
    office_number: DataTypes.STRING,
    office_phone: DataTypes.STRING,
    mobile_phone: DataTypes.STRING,
    fax: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state_province: DataTypes.STRING,
    zip: DataTypes.STRING,
    country_region: DataTypes.STRING
},{
    timestamps: false
});
module.exports = User;