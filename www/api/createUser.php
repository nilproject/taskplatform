<?php

include_once "../../backend/db/user.php";
include_once "../../backend/tools.php";
include_once "../../backend/security.php";

if (!is_numeric($_GET['vkuserid']))
    dieWithCode(400);

if (!$_GET['hash'])
    dieWithCode(400);

checkVkAuthentication($_GET['vkuserid'], $_GET['hash']);

$result = createUser(
    intval($_GET['vkuserid']),
    urldecode($_GET['role']), 
    urldecode($_GET['name']));

if ($result)
    echoJson($result);
else
    echoSuccess();