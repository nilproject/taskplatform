<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";

if (strlen($_POST["description"]) === 0)
    dieWithCode(400);

$reward = intval($_POST["reward"]);
if ($reward < 0 || $reward != $_POST["reward"])
    dieWithCode(400);

checkAuthentication();
checkRole($_COOKIE['userid'], ROLE_CUSTOMER);

$result = createTask($_COOKIE['userid'], $_POST["description"], $reward);

if ($result === null || $result["error"])
    dieWithCode(500);

echoSuccess();
