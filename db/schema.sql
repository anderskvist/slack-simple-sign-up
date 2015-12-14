CREATE TABLE events (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       event_name TEXT,
       event_owner TEXT,
       event_time INTEGER,
       event_rsvp INTEGER
       );

CREATE UNIQUE INDEX event ON events (event_name, event_owner, event_time);
