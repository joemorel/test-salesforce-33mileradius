/**
 * Created by joe on 5/24/17.
 */
'use strict';

const express = require('express');
const app = express();

var port = process.env.PORT || 8888;

app.get('/',function(req,res) {
    res.send('Hello, world!');
});

app.listen(port, function() {
    console.log('Started Express.js app on port:',port);
});