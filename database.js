const mysql = require('mysql');
const secret = require('./discord_secret');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: secret.db_password
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});