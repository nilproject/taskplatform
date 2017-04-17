<?php

include_once "../../backend/db/user.php";
include_once "../../backend/tools.php";
include_once "../../backend/security.php";

if (!$_GET['vkuserid'] || !intval($_GET['vkuserid']))
    dieWithCode(400);

if (!$_GET['hash'])
    dieWithCode(400);

checkVkAuthentication($_GET['vkuserid'], $_GET['hash']);

$result = createUser(
    $_GET['vkuserid'],
    urldecode($_GET['login']),
    urldecode($_GET['pass']), 
    urldecode($_GET['role']), 
    urldecode($_GET['name']));

if ($result)
    echo json_encode($result);
else
    echoSuccess();