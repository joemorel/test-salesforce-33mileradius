'use strict';

var http = require('http');
var url = require('url');

var port = process.env.port || 8888;

function onRequest(request,response) {
    console.log("Request received.");
    response.writeHead(200,{"Content-Type":"text/html"});
    response.write("<html><body><h2>Hello, world!</h2></body></html>");
    response.end();
}

http.createServer(onRequest).listen(port);

console.log("Server has started.");