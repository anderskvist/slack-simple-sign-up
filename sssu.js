#!/usr/bin/env node

//require("./database.js");

var http = require("http");
var Database = require("./database.js");
var database = new Database();

// inspiration: http://dalelane.co.uk/blog/?p=3152
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', function(req, res){

	var strargv = require("string-argv");
	var args = strargv.parseArgsStringToArgv(req.body.text);

	var yargs = require("yargs")
	    .exitProcess(false)
	    .usage( "Usage: $0 command")
	    /*	    .command( "attend", "Attend an event")
	    .command( "create", "Create an event")
	    .command( "help", "Show this")
	    .command( "list", "List all open events")
	    .command( "status", "Status of an event")
	    .required( 1, "command is required" )
	    .help('help')
	    */
	    .argv,
	    //	    .parse(args),
	    command = args[0];

	if (command == "help") {
	    res.send(yargs.help());
	} else if (command == "list") {
	    database.listEvents(res);
	} else {
	    res.send("Not implemented yet\n\n");
	}

	if (command == "create") {
	    //	    var yargs = require("yargs")
	    //		.usage('$0 create')

	}

	//	console.log(command);
	console.log(yargs);
	//	console.log(process.argv);

	yargs.reset;
	yargs = null;
});

app.listen(3000);
