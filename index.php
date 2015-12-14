<?php

include_once('config.inc.php');
include_once('functions.inc.php');
include_once('debug.inc.php');
include_once('database.inc.php');

/* Don't know if theese are necessary */
if ( 
    $_POST['token'] != 'iNINUuO1Xhu9Me0OunaZbL7g' ||
    $_POST['team_id'] != 'T04LP1S7R' ||
    $_POST['team_domain'] != 'hal9k' ||
    $_POST['channel_id'] != 'C0GJNBHV5' ||
    $_POST['channel_name'] != 'sandbox'
     ) exit;

$user_id = $_POST['user_id'];
$user_name = $_POST['user_name'];
$text = $_POST['text'];

if (!preg_match('/^(create|list|attend|status)/i', $text, $matches)) {
  echo "Unknown command, try again suckahr!";
  exit;
}

$command = strtolower($matches[1]);

switch ($command) {
case 'create':
  $event_owner = $user_name;
  if (preg_match('/^create ([\d\w]+) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}) ([\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2})$/i', $text, $matches)) {
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

  if (!dbCreateEvent($db, $event_name, $event_owner, $event_ts, $event_rvsp_ts)) {
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
}

// /feedme create CCC 2015-12-17 19:00 2015-12-16 16:00