<?php

include_once "commondb.php";

const GETTASK_ALL = 0;
const GETTASK_UNCOMPLETED = 1;
const GETTASK_COMPLETED = 2;

function getTasks($taskType) {
    $tasksTypeCondition = ($taskType === GETTASK_ALL ? " "
                        : ($taskType === GETTASK_UNCOMPLETED ? " WHERE State != 'Completed'"
                        : ($taskType === GETTASK_COMPLETED ? " WHERE State = 'Completed'"
                        : null)));

    if ($tasksTypeCondition === null)
        die("Invalid taskType");   

    return db_query("SELECT * FROM Tasks" . $tasksTypeCondition);
}