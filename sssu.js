#!/usr/bin/env node

require("./functions.js");

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
	    .command( "archive", "* Archive an event")
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
		.usage("Usage: " + req.body.command + ' list')
		.option('a', {alias: 'archived', describe: 'Show archived events', type: 'boolean'});

	    var argv = yargs.parse(args);
	    
	    if (argv.help) {
		res.send("*Prick!*\n" + yargs.help());
	    } else {
		database.listEvents(res, argv.archived);
	    }


	} else if (command == "status") {

	    /* STATUS */
	    yargs.reset()
		.exitProcess(false)
		.option('h', {alias: 'help', describe: 'Show help', type: 'boolean'})
		.fail(function() {})
		.usage("Usage: " + req.body.command + ' status --name "id of Event"')
		.option('n', {alias: 'id', describe: 'Id of the event', demand: true});

	    var argv = yargs.parse(args);

	    if (argv.id) {
		database.eventStatus(res, argv.id);
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
		.usage(req.body.command + ' attend --id "event id" ')
		.option('i', {alias: 'id', describe: 'Id of the event'})
		.option('a', {alias: 'attendees', describe: 'Number of attendees'})
		.default('a', 1)
		.option('t', {alias: 'text', describe: 'Text'});

	    var argv = yargs.parse(args);

	    console.log(argv);
	    if (argv.id) {
		database.attendEvent(res, argv.id, req.body.user_name, argv.attendees, argv.text);
	    } else {
		res.send("*Prick!*\n" + yargs.help());
	    }


	} else if (command == "archive") {

	    /* ARCHIVE */
	    yargs.reset()
		.exitProcess(false)
		.option('h', {alias: 'help', describe: 'Show help', type: 'boolean'})
		.fail(function() {})
		.usage(req.body.command + ' archive --id "event id" ')
		.option('i', {alias: 'id', describe: 'Id of the event'})
		.option('u', {alias: 'unarchive', describe: 'Unarchive an event', type: 'boolean'})

	    var argv = yargs.parse(args);

	    console.log(argv);
	    if (argv.id) {
		database.archiveEvent(res, argv.id, req.body.user_name, argv.unarchive);
	    } else {
		res.send("*Prick!*\n" + yargs.help());
	    }


	} else {

	    /* NOT IMPLEMENTED */
	    res.send("Not implemented yet\n\n");


	}
});

app.listen(3000);
