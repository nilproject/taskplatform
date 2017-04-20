<?php

include_once "../../backend/db/user.php";
include_once "../../backend/tools.php";
include_once "../../backend/security.php";


if (!is_numeric($_GET['userid']))
    dieWithCode(400);

if (!is_string($_GET['hash']))
    dieWithCode(400);

checkVkAuthentication($_GET['userid'], $_GET['hash']);

$userIdResponse = getUserIdByVkId(intval($_GET['userid']));

if (!$userIdResponse) 
    dieWithCode(403);

updateUserAuthInfo($userIdResponse['userId']);

echoSuccess();