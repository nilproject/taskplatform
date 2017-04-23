<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";
include_once "../../backend/db/user.php";
include_once "../../backend/db/transactions.php";

if (strlen($_POST["description"]) === 0)
    dieWithCode(400);

$reward = $_POST["reward"];
if (!is_numeric($reward))
    dieWithCode(400);

$userId = intval($_COOKIE['userid']);

checkAuthentication();
updateUserAuthInfo($userId);
checkRole($userId, ROLE_CUSTOMER);

$response = withdrawFunds($userId, $reward);
checkResponse($response);

try {
    $taskId = 0;
    $result = createTask($userId, $_POST["description"], $reward, $taskId);

    if ($result === null || array_key_exists("error", $result)) {
        dieWithCode(500);
    }

    if ($taskId === null || $taskId === 0) {
        dieWithCode(500);
    }

    try {
        $result = createTransaction(TRANSACTION_DIRECTION_FromUserToTask, $userId, $taskId, $reward);
        if ($result === null || array_key_exists("error", $result)) {
            dieWithCode(500);
        }
    } catch (Exception $e) {
        deleteTask($taskId);
        throw $e;
    }
} catch (Exception $e) {
    enrollFunds(userId, $reward);
    throw $e;
}

echoSuccess();
