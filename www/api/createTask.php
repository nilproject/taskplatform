<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";

if (strlen($_POST["description"]) === 0)
    dieWithCode(400);

$reward = $_POST["reward"];
if (!is_numeric($reward))
    dieWithCode(400);

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);
checkRole($_COOKIE['userid'], ROLE_CUSTOMER);

$result = createTask($_COOKIE['userid'], $_POST["description"], $reward);

if ($result === null || $result["error"])
    dieWithCode(500);

echoSuccess();
