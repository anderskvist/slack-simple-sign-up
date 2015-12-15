<?php

$token = 'SECRET';
$team_id = 'SECRET';

if ( 
    $_POST['token'] != $token ||
    $_POST['team_id'] != $team_id
     ) exit;

