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

var yargs = require("yargs");

app.post('/', function(req, res){

	var strargv = require("string-argv");
	var args = strargv.parseArgsStringToArgv(req.body.text);


	yargs.reset()
	    .exitProcess(false)
	    .usage( "Usage: $0 command")
	    .command( "attend", "Attend an event")
	    .command( "create", "Create an event")
	    .command( "help", "Show this")
	    .command( "list", "List all open events")
	    .command( "status", "Status of an event")
	    .required( 1, "command is required" )
	    .parse(args);

	var command = args[0];

	if (command == "help") {
	    res.send(yargs.help());
	} else if (command == "list") {
	    database.listEvents(res);
	} else if (command == "create") {
	    yargs.reset()
		.usage(req.body.command + ' create --name "Name of the event" --date "2016-01-01 18:00" --rsvp "2016-01-01 17:00" --note "Some not about this event."')
		.help('h')
		.option('name', {alias: 'n', describe: 'Name of the event'})
		.option('date', {alias: 'd', describe: 'Date and time of the event'})
		.option('rsvp', {alias: 'r', describe: 'RSVP date and time of the event'})
		.option('note', {alias: 'r', describe: 'Note for the event'})
		.parse(args);
	    res.send("create" + yargs.help());
	} else {
	    res.send("Not implemented yet\n\n");
	}
});

app.listen(3000);
