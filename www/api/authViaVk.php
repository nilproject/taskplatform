<?php

include "../../backend/db/user.php";
include "../../backend/tools.php";
include "../../backend/security.php";

if (!$_GET['userid'] || !val($_GET['userid']))
    dieWithCode(400);

if (!$_GET['hash'])
    dieWithCode(400);

checkVkAuthentication($_GET['userid'], $_GET['hash']);

$userId = getUserIdByVkId(val($_GET['userid']));

if (!$userId)
    dieWithCode(404);

$hash = makeAuthHash($userId);

setcookie("userid", $userId);
setcookie("hash", $hash);

echo '{ "result" : "success" }';