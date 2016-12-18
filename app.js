/**
 * Created by Victor on 18/12/2016.
 */
var http = require('http');
var server = http.createServer();

var port = process.env.PORT || 8080;
server.listen(port);
console.log("Listening on port " + port + "......");

module.exports = server;
