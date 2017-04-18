<?php

include_once "../../backend/db/user.php";
include_once "../../backend/tools.php";
include_once "../../backend/security.php";

if (!$_GET['userid'] || !intval($_GET['userid']))
    dieWithCode(400);

if (!$_GET['hash'])
    dieWithCode(400);

checkVkAuthentication($_GET['userid'], $_GET['hash']);

$userId = getUserIdByVkId(intval($_GET['userid']));

if (!$userId) 
    dieWithCode(403);

$hash = makeAuthHash($userId['userId']);

setcookie("userid", $userId['userId']);
setcookie("hash", $hash);

echoSuccess();