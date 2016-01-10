#!/usr/bin/env node

//require("./database.js");

var http = require("http");
var Database = require("./database.js");
var database = new Database();

// inspiration: http://dalelane.co.uk/blog/?p=3152
var express = require('express');
var app = express();

app.get('/', function(req, res){
    database.listEvents(res);
});

app.listen(3000);
