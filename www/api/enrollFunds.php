<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/transactions.php";

$amount = $_POST["amount"];
if (!is_numeric($amount))
    dieWithCode(400);

$userId = intval($_COOKIE['userid']);

checkAuthentication();
updateUserAuthInfo($userId);
checkRole($userId, ROLE_CUSTOMER);

$response = createTransaction(TRANSACTION_DIRECTION_FromSystemToUser, 1, $userId, $amount);
checkResponse($response);

$response = enrollFunds($userId, $amount);
checkResponse($response);

echoSuccess();
