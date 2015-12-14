<?php

$debug = FALSE;
$logfile = 'log/debug.log';

$dbfile = 'db/signup.db';

if ($debug) {
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
} else {
  error_reporting(E_ALL);
  ini_set('display_errors', 0);
}

