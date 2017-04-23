<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/settings.php";

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);

$commission = doubleval(getSetting('Commission')['value']);

echoJson([ "commission" => $commission ]);