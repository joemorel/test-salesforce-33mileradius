/**
 * Created by joe on 5/24/17.
 */
'use strict';

const express = require('express');
const app = express();
const pg = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);

var port = process.env.PORT || 8888;

app.get('/',function(req,res) {
    res.send('Hello, world!');
});

app.get('/account',function(req,res) {
    client.connect();
    const query = client.query(
        "SELECT createddate, phone, website, name, description, accountnumber from salesforce.account");
    query.on('row', function(row,err) {
        res.write(JSON.stringify(row));
    });
    query.on('end', function() {
        res.end();
        client.end();
    });
});

app.listen(port, function() {
    console.log('Started Express.js app on port:',port);
});