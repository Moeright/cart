var mysql = require("mysql");
var pool=mysql.createPool({
  host:"localhost",
  port:"3306",
  user:"root",
  password:"root",
  database:"my1704"
});
module.exports = pool;
