<?php

if (!file_exists($dbfile)) {
  echo "Database doesn't exist!";
  exit;
}

if (!is_writable($dbfile)) {
  echo "Database is not writable!";
  exit;
}

if (!is_writable(dirname($dbfile))) {
  echo "Database directory is not writable!";
  exit;
}

$db = new PDO('sqlite:' . $dbfile);
$db->setAttribute(PDO::ATTR_ERRMODE, 
		  PDO::ERRMODE_EXCEPTION);

function dbCreateEvent ($db, $event_name, $event_owner, $event_time, $event_rsvp = NULL) {

  $insert = "INSERT INTO events (event_name, event_owner, event_time, event_rsvp) 
                VALUES (:event_name, :event_owner, :event_time, :event_rsvp)";

  $stmt = $db->prepare($insert);

  $stmt->bindParam(':event_name', $event_name);
  $stmt->bindParam(':event_owner', $event_owner);
  $stmt->bindParam(':event_time', $event_time);
  $stmt->bindParam(':event_rsvp', $event_rsvp);

  return $stmt->execute();
}

function dbListEvents($db) {

  echo "*List of currently open events:*\n\n";

  $result = $db->query('SELECT events.*, IFNULL(SUM(attendees.attendee_num),0) AS attendee_num FROM events LEFT JOIN attendees ON events.id = attendees.event_id GROUP BY events.id ORDER BY `event_time` ASC');

  foreach ($result as $r) {
    echo '*' . $r['event_name'] . '* @ *' . my_date($r['event_time']) . '* by *' . $r['event_owner'] . '* (*' . $r['attendee_num'] . '*)';

    if ($r['event_rsvp'] != NULL) {
      echo ' (RSVP: ' . my_date($r['event_rsvp']) . ')';
    }

    echo "\n\n";
  }
}

function dbAttendEvent($db, $event_name, $attendee_name, $attendee_num, $attendee_text = NULL) {

  if ($attendee_num === NULL)
    $attendee_num = 1;

  $now = time();

  $select = 'SELECT id FROM events WHERE event_name = :event_name AND event_time > :now AND (event_rsvp > :now OR event_rsvp IS NULL)';

  $stmt = $db->prepare($select);

  $stmt->bindParam(':event_name', $event_name);
  $stmt->bindParam(':now', $now);

  $stmt->execute();
  $result = $stmt->fetchAll();

  if (count($result) != 1) {
    echo "Hmm, noway looser!";
    exit;
  }

  $event_id = $result[0]['id'];

  $insert = "INSERT INTO attendees (event_id, attendee_name, attendee_num, attendee_text) 
                VALUES (:event_id, :attendee_name, :attendee_num, :attendee_text)";
  
  $stmt = $db->prepare($insert);
  
  $stmt->bindParam(':event_id', $event_id);
  $stmt->bindParam(':attendee_name', $attendee_name);
  $stmt->bindParam(':attendee_num', $attendee_num);
  $stmt->bindParam(':attendee_text', $attendee_text);
  
  return $stmt->execute();
}

function dbEventStatus($db, $event_name) {
  echo "*List of attendees for " . $event_name . " :*\n\n";

  $now = time();

  $select = 'SELECT attendee_name, attendee_num, attendee_text FROM events,attendees WHERE events.event_name = :event_name AND events.id = attendees.event_id AND event_time > :now ORDER BY attendees.id ASC';

  $stmt = $db->prepare($select);

  $stmt->bindParam(':event_name', $event_name);
  $stmt->bindParam(':now', $now);

  $stmt->execute();
  $result = $stmt->fetchAll();

  $total = 0;
  foreach ($result as $r) {
    echo '*' . $r['attendee_name'] . '* (*' . $r['attendee_num'] . '*) ' . $r['attendee_text'];
    echo "\n\n";

    $total += $r['attendee_num'];
  }
  echo 'Total attendees: *' . $total . '*' . "\n\n";
}
