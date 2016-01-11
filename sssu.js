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

	console.log(req.body);
	console.log("\n");

	yargs.reset()
	    .exitProcess(false)
	    .option('h', {alias: 'help', describe: 'Show help', type: 'boolean'})
	    .fail(function() {})
	    .usage("Usage: " + req.body.command + ' command')
	    .command( "attend", "* Attend an event")
	    .command( "create", "* Create an event")
	    .command( "help", "Show this")
	    .command( "list", "List all open events")
	    .command( "status", "Status of an event");

	var argv = yargs.parse(args);
	var command = argv._;
	
	if (command == '') {

	    /* HELP */
	    res.send(yargs.help());


	}  else if (command == "help") {

	    /* HELP */
	    res.send(yargs.help());


	} else if (command == "list") {

	    /* LIST */
	    yargs.reset()
		.exitProcess(false)
		.option('h', {alias: 'help', describe: 'Show help', type: 'boolean'})
		.fail(function() {})
		.usage("Usage: " + req.body.command + ' list');

	    var argv = yargs.parse(args);
	    
	    if (argv.help) {
		res.send("*Prick!*\n" + yargs.help());
	    } else {
		database.listEvents(res);
	    }


	} else if (command == "status") {

	    /* STATUS */
	    yargs.reset()
		.exitProcess(false)
		.option('h', {alias: 'help', describe: 'Show help', type: 'boolean'})
		.fail(function() {})
		.usage("Usage: " + req.body.command + ' status --name "Name of Event"')
		.option('n', {alias: 'name', describe: 'Name of the event', demand: true});

	    var argv = yargs.parse(args);

	    if (argv.name) {
		database.eventStatus(res, argv.name);
	    } else {
		res.send("*Prick!*\n" + yargs.help());
	    }


	} else if (command == "create") {

	    /* CREATE */
	    yargs.reset()
		.exitProcess(false)
		.option('h', {alias: 'help', describe: 'Show help', type: 'boolean'})
		.fail(function() {})
		.usage(req.body.command + ' create --name "Name of the event" --date "2016-01-01 18:00" --rsvp "2016-01-01 17:00" --note "Some note about this event."')
		.option('n', {alias: 'name', describe: 'Name of the event', demand: true})
		.option('d', {alias: 'date', describe: 'Date and time of the event', demand: true})
		.option('r', {alias: 'rsvp', describe: 'RSVP date and time of the event'})
		.option('o', {alias: 'note', describe: 'Note for the event'});

	    var argv = yargs.parse(args);

	    if (argv.name && argv.date) {
		database.createEvent(res, argv.name, req.body.user_name, argv.date, argv.rsvp, argv.note);
	    } else {
		res.send("*Prick!*\n" + yargs.help());
	    }


	} else if (command == "attend") {

	    /* ATTEND */
	    yargs.reset()
		.exitProcess(false)
		.option('h', {alias: 'help', describe: 'Show help', type: 'boolean'})
		.fail(function() {})
		.usage(req.body.command + ' attend --name "Name of the event" ')
		.option('n', {alias: 'name', describe: 'Name of the event'})
		.option('i', {alias: 'id', describe: 'Id of the event'})
		.option('a', {alias: 'attendees', describe: 'Number of attendees'})
		.default('a', 1)
		.option('t', {alias: 'text', describe: 'Text'});

	    var argv = yargs.parse(args);

	    console.log(argv);
	    if (argv.id) {
		//database.attendEventId(res, argv.id, req.body.user_name, argv.attendees, argv.text);
		res.send("Attend Event by Id");
	    } else if (argv.name) {
		//database.attendEventName(res, argv.name, req.body.user_name, argv.attendees, argv.text);
		res.send("Attend Event by Name");
	    } else {
		res.send("*Prick!*\n" + yargs.help());
	    }


	} else {

	    /* NOT IMPLEMENTED */
	    res.send("Not implemented yet\n\n");


	}
});

app.listen(3000);
