var method = Database.prototype;

function Database() {
    var sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('db/signup.db');
}

method.listEvents = function (res) {
    var query = 'SELECT events.*, IFNULL(SUM(attendees.attendee_num),0) AS attendee_num FROM events LEFT JOIN attendees ON events.id = attendees.event_id GROUP BY events.id ORDER BY `event_time` ASC';

    this.db.each(query, function(err, row) {

	var output = '*' + row['event_name'] + '* @ *' + row['event_time'] + '* by *' + row['event_owner'] + '* (*' + row['attendee_num'] + '*)';
	
	if (row['event_rsvp'] != null) {
	    output += ' (RSVP: ' + row['event_rsvp'] + ')';
	}
	
	if (row['event_note'] != null) {
	    output +=  ' ' + row['event_note'];
	}
	
	if (this.lines == undefined) {
	    this.lines = "";
	}

	this.lines += output + "\n";
    },function () {
       res.send(this.lines);
    });

method.eventStatus = function (res, event_name) {
    var query = 'SELECT attendee_name, attendee_num, attendee_text FROM events,attendees WHERE events.event_name LIKE ? AND events.id = attendees.event_id ORDER BY attendees.id ASC';

    this.db.each(query, event_name, function(err, row, output) {
	    if (this.output == undefined) {
		this.output = "*List of attendees for " + event_name + " :*\n\n";
	    }

	    this.output += '*' + row.attendee_name + '* (*' + row.attendee_num + '*) ' + row.attendee_text + "\n";
	    if (this.total == undefined) {
		this.total = 0;
	    }

	    this.total += parseInt(row.attendee_num);
	    
	},function () {
	    if (this.output) {
		this.output += "\n" + 'Total attendees: *' + this.total + '*' + "\n\n";
		res.send(this.output);
	    } else {
		res.send("Event " + event_name + " doesn't exist.");
	    }
	});
}

module.exports = Database;
