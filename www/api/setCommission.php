<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/settings.php";

if (!is_numeric($_POST["commission"])) {
    dieWithCode(400);
}

$newCommission = doubleval($_POST["commission"]);

if ($newCommission < 0 || $newCommission > 1) {
    dieWithCode(400);
}

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);

$token = getSetting('SystemToken')['value'];
if ($_POST["token"] !== $token) {
    dieWithCode(403);
}

if (!isAdmin($_COOKIE['userid'])) {
    dieWithCode(403);
}

$response = setSetting('Commission', $newCommission);
checkResponse($response);

echoSuccess();