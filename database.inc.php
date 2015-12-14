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

  $result = $db->query('SELECT * FROM events ORDER BY `event_time` ASC');

  foreach ($result as $r) {

    echo '*' . $r['event_name'] . '* @ *' . my_date($r['event_time']) . '* by *' . $r['event_owner'] . '*';

    if ($r['event_rsvp'] != NULL) {
      echo ' (RSVP: ' . my_date($r['event_rsvp']) . ')';
    }

    echo "\n\n";
  }
}