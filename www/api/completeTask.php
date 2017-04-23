<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";
include_once "../../backend/db/user.php";
include_once "../../backend/db/transactions.php";

if (!is_numeric($_GET['taskid']))
    dieWithCode(400);

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);
checkRole($_COOKIE['userid'], ROLE_EXECUTOR);

$userId = intval($_COOKIE['userid']);
$taskId = intval($_GET['taskid']);

$response = completeTask($taskId, $userId);
checkResponse($response);

$resward = null;

$response = getTaskReward($taskId);
checkResponse($response);

$reward = $response[0]['reward'];

$response = createTransaction(TRANSACTION_DIRECTION_FromTaskToUser, $taskId, $userId, $reward);
checkResponse($response);

$response = enrollFunds($_COOKIE['userid'], $reward);
checkResponse($response);

echoSuccess();
