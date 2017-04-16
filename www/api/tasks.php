<?php

include_once "../../backend/db/tasks.php";

$taskType = GETTASK_ALL;
switch ($_GET["type"]) {
    case null: 
    case "0": break;
    case "1": $taskType = GETTASK_UNCOMPLETED; break;
    case "2": $taskType = GETTASK_COMPLETED; break;
    default: header('HTTP/1.1 400 Bad Request', true, 400); die(400);
}

echo json_encode(getTasks($taskType));
