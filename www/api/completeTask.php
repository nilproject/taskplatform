<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";
include_once "../../backend/db/user.php";
include_once "../../backend/db/transactions.php";
include_once "../../backend/db/settings.php";

if (!is_numeric($_GET['taskid']))
    dieWithCode(400);

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);
checkRole($_COOKIE['userid'], ROLE_EXECUTOR);

$userId = intval($_COOKIE['userid']);
$taskId = intval($_GET['taskid']);

$taskCompleted = tryCompleteTask($taskId, $userId);
if (!$taskCompleted) {
    dieWithCode(409);
}

$resward = null;

$response = getTaskReward($taskId);
checkResponse($response);

$reward = $response[0]['reward'];
$commission = doubleval(getSetting('Commission')['value']);

$response = createTransaction(TRANSACTION_DIRECTION_FromTaskToUser, $taskId, $userId, $reward, 1.0 - $commission);
checkResponse($response);

$response = createTransaction(TRANSACTION_DIRECTION_FromTaskToUser, $taskId, 0, $reward, $commission);
checkResponse($response);

$response = enrollFunds($userId, doubleval($reward) * (1.0 - $commission));
checkResponse($response);

$response = enrollFunds(USER_SYSTEM, doubleval($reward) * $commission);
checkResponse($response);

echoSuccess();
