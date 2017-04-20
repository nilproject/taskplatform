<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";

if (strlen($_POST["description"]) === 0)
    dieWithCode(400);

if (!is_numeric($_POST["reward"]))
    dieWithCode(400);
$reward = floatval($_POST["reward"]);

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);
checkRole($_COOKIE['userid'], ROLE_CUSTOMER);

$result = createTask($_COOKIE['userid'], $_POST["description"], $reward);

if ($result === null || $result["error"])
    dieWithCode(500);

echoSuccess();
