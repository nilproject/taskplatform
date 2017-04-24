<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/transactions.php";
include_once "../../backend/db/user.php";
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

$limit = intval($_GET["limit"]);
if ($limit === 0)
    $limit = 25;

$transactions = getTransactions($limit, $timestamp, DIRECTION_NEW);
checkResponse($transactions);

echoJson([ "transactions" => $transactions ]);
