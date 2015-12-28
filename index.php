<?php

include_once('secrets.inc.php');
include_once('config.inc.php');
include_once('functions.inc.php');
include_once('debug.inc.php');
include_once('database.inc.php');

$user_id = $_POST['user_id'];
$user_name = $_POST['user_name'];
$text = $_POST['text'];

if (!preg_match('/^(create|list|attend|status|modify|help)/i', $text, $matches)) {
  echo "Unknown command, try again suckahr!";
  exit;
}

$command = strtolower($matches[1]);

switch ($command) {
case 'create':
  $event_owner = $user_name;
  if (preg_match('/^create ([\d\w]+) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}) (.*)$/i', $text, $matches)) {
    $event_name = $matches[1];
    $event_time = $matches[2];
    $event_rvsp_time = $matches[3];
    $event_note = $matches[4];
  } else if (preg_match('/^create ([\d\w]+) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2})$/i', $text, $matches)) {
    $event_name = $matches[1];
    $event_time = $matches[2];
    $event_rvsp_time = $matches[3];
  } else if (preg_match('/^create ([\d\w]+) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2})$/i', $text, $matches)) {
    $event_name = $matches[1];
    $event_time = $matches[2];
    $event_rvsp_time = NULL;
  } else {
    echo "error";
  }

  var_dump($matches);

  $now = time();
  $event_ts = datetime_to_unix($event_time);

  if ($now > $event_ts) {
    echo "You cannot create an event in the past - dumbass!";
    exit;
  }

  if ($event_rvsp_time) {
    $event_rvsp_ts = datetime_to_unix($event_rvsp_time);

    if ($now > $event_rvsp_ts) {
      echo "You cannot create an event with rvsp in the past - stupid!";
      exit;
    }

    if ($event_ts < $event_rvsp_ts) {
      echo "You cannot create an event with rvsp after the event - you son of a biaaaach!";
      exit;
    }
  }

  if (!dbCreateEvent($db, $event_name, $event_owner, $event_ts, $event_rvsp_ts, $event_note)) {
    echo "Error creating event!";
    exit;
  } else {
    echo 'Congratulations! You have just created an event (' . $event_name . ') on ' . my_date($event_ts);
    echo "\n";
  }

  break;

case 'list':
  dbListEvents($db);

  break;

case 'help':
  echo '*List of commands*:' . "\n\n";
  echo '*' . $_POST['command'] . ' help* - this view' . "\n\n";
  echo '*' . $_POST['command'] . ' create NameOfEvent YYYY-MM-DD HH:mm [YYYY-MM-DD HH:mm]* - create an event (RSVP optional)' . "\n\n";
  echo '*' . $_POST['command'] . ' attend NameOfEvent [NumberOfAttendees [Text]]* - attend an event (number of attendees and text are optional)' . "\n\n";
  echo '*' . $_POST['command'] . ' list* - list all open events' . "\n\n";
  echo '*' . $_POST['command'] . ' status NameOfEvent* - show status for an evvent' . "\n\n";

  break;

case 'attend':
  $attendee_name = NULL;
  $event_name = NULL;
  $attendee_number = NULL;
  $attendee_text = NULL;

  if (preg_match('/^attend ([\w\d]+) ([\d]+) (.*)$/', $text, $matches)) {
    $attendee_name = $user_name;
    $event_name = $matches[1];
    $attendee_number = $matches[2];
    $attendee_text = $matches[3];
  } else if (preg_match('/^attend ([\w\d]+) ([\d]+)$/', $text, $matches)) {
    $attendee_name = $user_name;
    $event_name = $matches[1];
    $attendee_number = $matches[2];
  } else if (preg_match('/^attend ([\w\d]+)$/', $text, $matches)) {
    $attendee_name = $user_name;
    $event_name = $matches[1];
  } else {
    echo "Fuckoff shit brain!";
    exit;
  }

  if (dbAttendEvent($db, $event_name, $attendee_name, $attendee_number, $attendee_text)) {
    echo "success";
  } else {
    echo "failure";
  }

  break;
case 'status':
  if (preg_match('/^status ([\w\d]+)$/', $text, $matches)) {
    dbEventStatus($db, $matches[1]);
  } else {
    echo "Prick!";
  }

  break;

case 'modify':
  $event_owner = $user_name;
  $event_name = NULL;
  $event_time = NULL;
  $event_rsvp_time = NULL;
  $event_note = NULL;
  if (preg_match('/^modify ([\d\w]+) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}) (.*)$/i', $text, $matches)) {
    $event_name = $matches[1];
    $event_time = $matches[2];
    $event_rsvp_time = $matches[3];
    $event_note = $matches[4];
  } else if (preg_match('/^create ([\d\w]+) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2})$/i', $text, $matches)) {
    $event_name = $matches[1];
    $event_time = $matches[2];
    $event_rsvp_time = $matches[3];
  } else if (preg_match('/^create ([\d\w]+) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2})$/i', $text, $matches)) {
    $event_name = $matches[1];
    $event_time = $matches[2];
  } else {
    echo "Nothing to change!";
  }
  dbModifyEvent($db, $event_name, $event_owner, datetime_to_unix($event_time), datetime_to_unix($event_rsvp_time), $event_note);
  break;
}

// /feedme create CCC 2015-12-17 19:00 2015-12-16 16:00