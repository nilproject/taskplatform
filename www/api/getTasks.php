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
if ($timestamp === 0)
    $timestamp = PHP_INT_MAX;

$limit = intval($_GET["limit"]);
if ($limit === 0)
    $limit = 25;

$tasks = getTasks($taskType, intval($_COOKIE["userid"]), $limit, $timestamp);

if ($tasks === null)
    dieWithCode(500);

$users = [];
foreach ($tasks as $task) {
    $users[$task["creatorId"]] = '';
    if ($task["executorId"])
        $users[$task["executorId"]] = '';
}

if (count($users)) {
    $tempUsers = getUsers(array_keys($users));
    $users = [];
    foreach ($tempUsers as $user) {
        $users[$user["userId"]] = $user;
    }
}

echo json_encode([ "tasks" => $tasks, "users" => $users ]);
