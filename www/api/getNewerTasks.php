<?php

include_once "../../backend/tools.php";
include_once "../../backend/security.php";
include_once "../../backend/db/constants.php";
include_once "../../backend/db/tasks.php";
include_once "../../backend/db/user.php";

checkAuthentication();

$taskType = GETTASK_ALL;
switch ($_GET["type"]) {
    case null: 
    case "todo": $taskType = GETTASK_UNCOMPLETED;  break;
    case "done": $taskType = GETTASK_COMPLETED; break;
    case "my": $taskType = GETTASK_ASSIGNEDTOUSER; break;
    case "owned": $taskType = GETTASK_CREATEDBYUSER; break;
    case "all": $taskType = GETTASK_ALL; break;
    default: dieWithCode(400);
}

$timestamp = intval($_GET["time"]);

$limit = intval($_GET["limit"]);
if ($limit === 0)
    $limit = 25;

$tasks = getTasks($taskType, intval($_COOKIE["userid"]), $limit, $timestamp, GETTASK_DIRECTION_NEW);

if ($tasks === null || isset($tasks['error']))
    dieWithCode(500);

$users = loadUsersForTasks($tasks);

echo json_encode([ "tasks" => $tasks, "users" => $users ]);