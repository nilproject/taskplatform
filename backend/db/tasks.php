<?php

include_once "commondb.php";
include_once "constants.php";

function getTasks($taskType, $userId, $limit, $timestamp, $compareDirection) {
    $prms = [];
    $types = "";
    $select = "SELECT taskId, creatorId, executorId, reward, description, status, created FROM Tasks";
    $timeComparision = $compareDirection === 0 ? "(Created < ?)" : "(Created > ?)";
    $condition   = "";    
    switch ($taskType) {
        case GETTASK_CREATEDBYUSER: {
            $prms[] = $userId;
            $types .= "i";
            $condition = " WHERE (CreatorID = ?)";
            break;
        }

        case GETTASK_ALL: {
            $condition = " WHERE 1 ";
            break;
        }

        case GETTASK_UNCOMPLETED: {
            $condition = " WHERE Status != 'Done'";
            break;
        }

        case GETTASK_COMPLETED: {
            $condition = " WHERE Status = 'Done'";
            break;
        }

        case GETTASK_ASSIGNEDTOUSER: {
            $prms[] = $userId;
            $types .= "i";
            $condition = " WHERE ExecutorID = ?";
            break;
        }

        case GETTASK_COMPLETEDBYUSER: {
            $prms[] = $userId;
            $types .= "i";
            $condition = " WHERE ExecutorID = ? AND Status = 'Done'";
            break;
        }

        case GETTASK_UNCOMPLETEDBYUSER: {
            $prms[] = $userId;
            $types .= "i";
            $condition = " WHERE ExecutorID = ? AND Status != 'Done'";
            break;
        }

        default: return null;
    }

    $order = "";
    if ($compareDirection === DIRECTION_NEW) {
        $order = " ORDER BY created ASC";
    } else {
        $order = " ORDER BY Created DESC";
    }
    
    $prms[] = $timestamp;
    $types .= "i";
    $prms[] = $limit;
    $types .= 'i';

    $query = $select . $condition . " AND " . $timeComparision . $order . " LIMIT ?";

    $link = db_connect();
    $result = db_connectedQuery($link, $query, $prms, $types);
    $resultSize = count($result);
    if ($resultSize > 0 && $resultSize === $limit) {
        $minTime = $result[$resultSize - 1]["created"];
        $prms[count($prms) - 2] = $minTime;
        $addResult = db_connectedQuery($link, $select . $condition . " AND (Created = ?)", $prms, $types);

        $removeCount = 1;
        while ($removeCount < $resultSize && $result[$resultSize - $removeCount]["created"] === $minTime) {
            $removeCount++;
        }

        array_splice($result, $resultSize - $removeCount, $removeCount);
        $result = array_merge($result, $addResult);
    }

    db_close($link);
    return $result;
}

function createTask($creatorId, $description, $reward, &$taskId) {
    $taskIds = [];
    $result = db_query("INSERT INTO Tasks (CreatorID, Reward, Description, Created)
                     VALUES (?, ?, ?, ?)",
                     [
                         $creatorId,
                         $reward,
                         $description,
                         now()
                     ], 
                     'idsi',
                     "GO;",
                     $taskIds);

    if (array_key_exists(0, $taskIds))
        $taskId = $taskIds[0];
    
    return $result;
}

function deleteTask($taskId) {
    return db_query("DELETE FROM Tasks
                    WHERE TaskID = ?",
                    [
                        $taskId
                    ], 
                    'idsi');
}

function tryCompleteTask($taskid, $userId) {
    $insertedRows = null;
    $affectedRowsCount = 0;
    $response = db_query("UPDATE Tasks
                     SET ExecutorID = ?, Status = 'Done'
                     WHERE TaskID = ? AND ExecutorID IS NULL AND Status = 'ToDo'",
                     [
                         $userId,
                         $taskid
                     ],
                     'ii',
                     'GO;',
                     $insertedRows,
                     $affectedRowsCount);
    checkResponse($response);
    return $affectedRowsCount !== 0;
}

function getTaskReward($taskid) {
    return db_query("SELECT reward
                     FROM Tasks
                     WHERE TaskID = ?",
                     [
                         $taskid
                     ],
                     'i');
}

function getUserIdsForTasks($tasks) {
    $users = [];
    foreach ($tasks as $task) {
        $users[$task["creatorId"]] = '';
        if ($task["executorId"])
            $users[$task["executorId"]] = '';
    }

    return array_keys($users);
}