<?php

if ($debug === TRUE) {
  
  if (!file_exists($logfile)) {
    echo "Debug enabled, but logfile doesn't exist!";
    exit;
  }

  if (!is_writable($logfile)) {
    echo "Debug enabled, but logfile not writable!";
    exit;
  }

  file_put_contents(
		    $logfile, 
		    var_export($_POST, true), 
		    FILE_APPEND
		    );
}
