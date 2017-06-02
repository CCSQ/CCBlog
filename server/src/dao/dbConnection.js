var mysql = require('mysql')
var config = require('../config')

var options = config.mysqlConfig

var connection = mysql.createConnection(options)

module.exports = connection