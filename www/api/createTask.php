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

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);
checkRole($_COOKIE['userid'], ROLE_CUSTOMER);

$result = withdrawFunds($_COOKIE['userid'], $reward);

if ($result === null)
    dieWithCode(500);

if (array_key_exists("error", $result)) {
    echoJson($result["error"]);
    dieWithCode(402);
}

try {
    $taskId = 0;
    $result = createTask($_COOKIE['userid'], $_POST["description"], $reward, $taskId);

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
    enrollFunds($_COOKIE['userid'], $reward);
    throw $e;
}

echoSuccess();
