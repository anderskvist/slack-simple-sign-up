CREATE TABLE events (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       event_name TEXT,
       event_owner TEXT,
       event_time INTEGER,
       event_rsvp INTEGER
       );

CREATE UNIQUE INDEX event ON events (event_name, event_owner, event_time);

CREATE TABLE attendees (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       event_id INTEGER,
       attendee_name TEXT,
       attendee_num INTEGER,
       attendee_text TEXT
       );

CREATE UNIQUE INDEX attendee ON attendees (event_id, attendee_name);
