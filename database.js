var method = Database.prototype;

function Database() {
    var sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('db/signup.db');
}

method.listEvents = function () {
    console.log(this.db);

    var query = 'SELECT events.*, IFNULL(SUM(attendees.attendee_num),0) AS attendee_num FROM events LEFT JOIN attendees ON events.id = attendees.event_id GROUP BY events.id ORDER BY `event_time` ASC';
    
    this.db.each(query, function(err, row) {
	
	var output = '*' + row['event_name'] + '* @ *' + row['event_time'] + '* by *' + row['event_owner'] + '* (*' + row['attendee_num'] + '*)';
	
	if (row['event_rsvp'] != null) {
	    output += ' (RSVP: ' + row['event_rsvp'] + ')';
	}
	
	if (row['event_note'] != null) {
	    output +=  ' ' + row['event_note'];
	}

	console.log(output);
    });
}

module.exports = Database;
