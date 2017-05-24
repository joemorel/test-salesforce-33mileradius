'use strict';

var http = require('http');
var url = require('url');

var pg = require('pg');

var port = process.env.PORT || 8888;

pg.defaults.ssl = true;

function onRequest(request,response) {
    console.log("Request received.");
    response.writeHead(200,{"Content-Type":"text/json"});
    pg.connect(process.env.DATABASE_URL, function(err, client) {
        client.query('SELECT * from account;')
        .on('row', function(row) {
            response.write(JSON.stringify(row));
            response.end();
        });
    });

}

http.createServer(onRequest).listen(port);

console.log("Server has started on port",port);