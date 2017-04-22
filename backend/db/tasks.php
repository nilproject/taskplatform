<?php

include_once "commondb.php";

const GETTASK_ALL = 0;
const GETTASK_CREATEDBYUSER = 1;
const GETTASK_UNCOMPLETED = 2;
const GETTASK_COMPLETED = 3;
const GETTASK_ASSIGNEDTOUSER = 4;
const GETTASK_COMPLETEDBYUSER = 5;

const GETTASK_DIRECTION_OLD = 0;
const GETTASK_DIRECTION_NEW = 1;

function getTasks($taskType, $userId, $limit, $timestamp, $compareDirection) {
    $queryPrefix = "CALL getTasks(?, ?, ?); 
                    GO;
                    SELECT taskId, creatorId, executorId, reward, description, status, created FROM rslt_taskList";
    $condition   = "";
    
    switch ($taskType) {
        case GETTASK_CREATEDBYUSER: {
            return db_query(
                $queryPrefix . " WHERE CreatorID = ? ", 
                [ $timestamp, $limit, $compareDirection, $userId ],
                'iiii');    
        }

        case GETTASK_ALL: {
            $condition = " WHERE 1 ";
            break;
        }

        case GETTASK_UNCOMPLETED: {
            $condition = " WHERE Status != 'Done' ";
            break;
        }

        case GETTASK_COMPLETED: {
            $condition = " WHERE Status = 'Done' ";
            break;
        }

        case GETTASK_ASSIGNEDTOUSER: {
            $condition = " WHERE ExecutorID = ? ";
            return db_query(
                $queryPrefix . $condition, 
                [ $timestamp, $limit, $compareDirection, $userId ],
                'iiii');
        }

        case GETTASK_COMPLETEDBYUSER: {
            $condition = " WHERE ExecutorID = ? AND Status = 'Done' ";
            return db_query(
                $queryPrefix . $condition, 
                [ $timestamp, $limit, $compareDirection, $userId ],
                'iiii');
        }

        case GETTASK_UNCOMPLETEDBYUSER: {
            $condition = " WHERE ExecutorID = ? AND Status != 'Done' ";
            return db_query(
                $queryPrefix . $condition, 
                [ $timestamp, $limit, $compareDirection, $userId ],
                'iiii');
        }

        default: return null;
    }

    $suffix = "";
    if ($compareDirection === GETTASK_DIRECTION_NEW) {
        $suffix = "ORDER BY created ASC";
    }

    return db_query(
        $queryPrefix . $condition . $suffix, 
        [ $timestamp, $limit, $compareDirection ],
        'iii');
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

function completeTask($taskid, $userId) {
    return db_query("UPDATE Tasks
                     SET ExecutorID = ?, Status = 'Done'
                     WHERE TaskID = ?",
                     [
                         $userId,
                         $taskid,
                     ],
                     'ii');
}

function loadUsersForTasks($tasks) {
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

    return $users;
}