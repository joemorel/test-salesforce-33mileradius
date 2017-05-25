/**
 * Created by joe on 5/24/17.
 */
'use strict';

const express = require('express');
const app = express();
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/testsalesforce";
console.log(connectionString);
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

app.post('/account',function(req,res) {
   client.connect();
    console.log("Output:",req.body.phone);
   const query = client.query(
       "INSERT INTO salesforce.account (phone, website, name, description, accountnumber) VALUES(",req.body.phone,",",req.body.website,",",req.body.name,",",req.body.description,req.body.accountnumber,")"
   );
});

app.listen(port, function() {
    console.log('Started Express.js app on port:',port);
});