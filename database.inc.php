<?php

if (!file_exists($dbfile)) {
  echo "Database doesn't exist!";
  exit;
}

if (!is_writable($dbfile)) {
  echo "Database is not writable!";
  exit;
}

$db = new PDO('sqlite:' . $dbfile);

if (!$db) {
  echo "Couldn't connect to database!";
  exit;
}

function dbCreateEvent ($db, $user_name, $event_name, $date, $rsvp = NULL) {
  return true;
}