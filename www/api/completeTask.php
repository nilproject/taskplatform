<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";

if (!$_GET['taskid'] || !intval($_GET['taskid']))
    dieWithCode(400);

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);
checkRole($_COOKIE['userid'], ROLE_EXECUTOR);

$result = completeTask($_COOKIE['userid'], $_GET['taskid']);
if ($result === null || $result["error"])
    dieWithCode(500);

echoSuccess();
