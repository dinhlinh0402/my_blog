var config = require('config');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: config.get('mysql.host'),
    user: config.get('mysql.user'),
    password: config.get('mysql.password'),
    database: config.get('mysql.database')
});

connection.connect();

function getConnection() {
    if(!connection){
        console.log('Connection failed !!!');
        connection.connect();
    } else {
        console.log('Connection success !!!');
        return connection;
    }

    // return connection;
}

module.exports = {
    getConnection
}