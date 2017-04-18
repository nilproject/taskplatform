<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";

if (!$_POST["description"] || !$_POST["reward"])
    dieWithCode(400);

checkAuthentication();
checkRole($_COOKIE['userid'], ROLE_CUSTOMER);

$result = createTask($_COOKIE['userid'], $_POST["description"], $_POST["reward"]);
if ($result === null || $result["error"])
    dieWithCode(500);

echoSuccess();
