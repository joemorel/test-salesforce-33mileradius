/**
 * Created by joe on 5/24/17.
 */
'use strict';

const express = require('express');
const app = express();
const pg = require('pg');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
const connectionString = process.env.DATABASE_URL || "postgres://localhost:5432/testsalesforce";
console.log(connectionString);
const client = new pg.Client(connectionString);
console.log("created PostgreSQL client");
var port = process.env.PORT || 8888;

app.get('/',function(req,res) {
    console.log("hit root with GET");
    res.send('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>33 Mile Radius Login</title></head><body><h1>Welcome to the 33 Mile Radius Platform!</h1><h3>Login here:</h3><form action="/login" method="POST"><label>Email: </label><input type="text" name="email" length="20"/><br/><label>Password:</label><input type="password" name="passsword" length="20"/><br/><input type="submit"/></form></body></html>');
});

app.get('/account',function(req,res) {
    var responseBody = req.body;
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

app.post('/login', function(req,res) {
    client.connect();
    var queryText = "SELECT name from salesforce.account where email__c = '" + req.body.email + "' and password__c = '" + req.body.password + "'";
    console.log(queryText);
    const query = client.query(queryText);
    query.on('row', function(row) {
        res.send("Welcome to the platform",row.name);
    });
    query.on('end',function(){
        client.end();
    });
    query.on('error',function(error) {
        res.send(error);
        client.end();
    });
});

app.post('/account',function(req,res) {
   client.connect();
   var queryText = "INSERT INTO salesforce.account (phone, website, name, description, accountnumber) VALUES ('" + req.body.phone + "','" + req.body.website + "','" + req.body.name + "','" + req.body.description + "','" + req.body.accountnumber + "')";
   console.log(queryText);
   const query = client.query(queryText);
   query.on('end', function(result) {
       res.send(result.toString());
       client.end();
   });

   query.on('error', function(err) {
       console.log(err);
   });
});

app.listen(port, function() {
    console.log('Started Express.js app on port:',port);
});