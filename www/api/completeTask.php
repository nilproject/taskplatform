<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";

if (!is_numeric($_GET['taskid']))
    dieWithCode(400);

checkAuthentication();
updateUserAuthInfo($_COOKIE['userid']);
checkRole($_COOKIE['userid'], ROLE_EXECUTOR);

$result = completeTask(intval($_GET['taskid']), intval($_COOKIE['userid']));
if ($result === null || $result["error"])
    dieWithCode(500);

echoSuccess();
