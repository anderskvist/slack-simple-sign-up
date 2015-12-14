<?php

$debug = FALSE;
$logfile = 'debug.log';

$dbfile = 'signup.db';

if ($debug) {
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
} else {
  error_reporting(E_ALL);
  ini_set('display_errors', 0);
}

