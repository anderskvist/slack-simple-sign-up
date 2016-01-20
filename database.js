var method = Database.prototype;

function Database() {
    var sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('db/signup.db');
}

method.listEvents = function (res, show_archived) {
    var query = 'SELECT events.*, IFNULL(SUM(attendees.attendee_num),0) AS attendee_num FROM events LEFT JOIN attendees ON events.id = attendees.event_id WHERE events.event_archived = ' + (show_archived ? 1 : 0) + ' GROUP BY events.id ORDER BY `event_time` ASC';

    this.db.each(query, function(err, row) {
	    
	    var output = '*' + row['event_name'] + '* *(' + row['id'] + ')* @ *' + unixtime_to_datetime(row['event_time']) + '* by *' + row['event_owner'] + '* (*' + row['attendee_num'] + '*)';
	
	    if (row['event_rsvp'] != null) {
		output += ' (RSVP: ' + unixtime_to_datetime(row['event_rsvp']) + ')';
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
}

method.eventStatus = function (res, event_id) {
    var query = 'SELECT event_name, attendee_name, attendee_num, attendee_text FROM events,attendees WHERE events.id LIKE ? AND events.id = attendees.event_id ORDER BY attendees.id ASC';

    this.db.each(query, event_id, function(err, row, output) {
	    if (this.output == undefined) {
		this.output = "*List of attendees for " + row.event_name + " :*\n\n";
	    }

	    this.output += '*' + row.attendee_name + '* (*' + row.attendee_num + '*) ' + (row.attendee_text ? row.attendee_text : "") + "\n";
	    if (this.total == undefined) {
		this.total = 0;
	    }

	    this.total += parseInt(row.attendee_num);
	    
	},function () {
	    if (this.output) {
		this.output += "\n" + 'Total attendees: *' + this.total + '*' + "\n\n";
		res.send(this.output);
	    } else {
		res.send("Event " + event_id + " doesn't exist or no attendees.");
	    }
	});
}

method.createEvent = function (res, event_name, event_owner, event_date, event_rsvp, event_note) {
    console.log(event_name);
    console.log(event_date);
    console.log(event_rsvp);
    console.log(event_note);

    var query = 'INSERT INTO events (event_name, event_owner, event_time, event_rsvp, event_note) VALUES (:event_name, :event_owner, :event_time, :event_rsvp, :event_note)';

    var test = this.db.run(query, event_name, event_owner, event_date, event_rsvp, event_note, function(err) {
	    if (err) {
		res.send("Error!");
		console.log(err);
	    } else {
		res.send("Success!");
	    }
	});
}

method.attendEvent = function (res, event_id, attendee_name, attendee_num, attendee_text) {
    var now = Math.floor(new Date() / 1000);

    var query = 'SELECT * FROM events WHERE id = :event_id AND event_rsvp > :now';
    var test = this.db.get(query, event_id, now, function(err, row) {
	    if (err) {
		console.log("doesn't exist");
	    } else {
		console.log("exists");
	    }
	    // FIXME: use this information!!!
	});

    var query = 'REPLACE INTO attendees (event_id, attendee_name, attendee_num, attendee_text) VALUES (:event_id, :attendee_name, :attendee_num, :attendee_text)';
    var test = this.db.run(query, event_id, attendee_name, attendee_num, attendee_text, function(err) {
	    if (err) {
		res.send("Error!");
		console.log(err);
	    } else {
		res.send("Success!");
	    }
	});
}

method.archiveEvent = function (res, event_id, event_owner, event_unarchive) {
    if (event_unarchive) {
	var query = 'UPDATE events SET event_archived = 0 WHERE id = :event_id AND event_owner = :event_owner';
    } else {
	var query = 'UPDATE events SET event_archived = 1 WHERE id = :event_id AND event_owner = :event_owner';
    }

    console.log(event_owner);

    var test = this.db.run(query, event_id, event_owner, function(err) {
	    if (err) {
		res.send("Error!");
		console.log(err);
	    } else {
		res.send("Success!");
	    }
	});
}

module.exports = Database;
