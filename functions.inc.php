<?php

function datetime_to_unix ($datetime) {
    $tsa = date_parse($datetime);
    $ts = mktime(
		       $tsa['hour'],
		       $tsa['minute'],
		       $tsa['second'],
		       $tsa['month'],
		       $tsa['day'],
		       $tsa['year']
		       );
    return $ts;
}