<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/settings.php";

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);

$token = getSetting('SystemToken')['value'];
if ($_GET["token"] !== $token) {
    dieWithCode(403);
}

if (!isAdmin($_COOKIE['userid'])) {
    dieWithCode(403);
}

$cash = getUserInfo(USER_SYSTEM)['cash'];

echoJson([ "cash" => $cash ]);