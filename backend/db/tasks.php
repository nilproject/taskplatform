<?php

include_once "commondb.php";
include_once "constants.php";

function getTasks($taskType, $userId, $limit, $timestamp, $compareDirection) {
    $queryPrefix = "SET @timestamp = ?; GO;
                    SET @compareDirection = ?; GO;

                    CREATE TEMPORARY TABLE tmp_temp
                    SELECT * 
                    FROM Tasks 
                    WHERE (@compareDirection = 0 AND (Created < @timestamp))
                       || (@compareDirection != 0 AND (Created > @timestamp))
                    ORDER BY Created DESC 
                    LIMIT ?;
                    GO;
                    
                    SET @created = (SELECT MIN(Created) FROM tmp_temp);
                    GO;

                    CREATE TEMPORARY TABLE tmp_temp2 
                    SELECT *
                    FROM Tasks 
                    WHERE Created = @created;
                    GO;

                    CREATE TEMPORARY TABLE tmp_result
                    SELECT *
                    FROM tmp_temp
                    WHERE created != @created 
                    UNION ALL 
                    SELECT *
                    FROM tmp_temp2;
                    GO;
                    
                    SELECT taskId, creatorId, executorId, reward, description, status, created 
                    FROM tmp_result";
    $condition   = "";
    
    switch ($taskType) {
        case GETTASK_CREATEDBYUSER: {
            return db_query(
                $queryPrefix . " WHERE CreatorID = ? ", 
                [ $timestamp, $compareDirection, $limit, $userId ],
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
                [ $timestamp, $compareDirection, $limit, $userId ],
                'iiii');
        }

        case GETTASK_COMPLETEDBYUSER: {
            $condition = " WHERE ExecutorID = ? AND Status = 'Done' ";
            return db_query(
                $queryPrefix . $condition, 
                [ $timestamp, $compareDirection, $limit, $userId ],
                'iiii');
        }

        case GETTASK_UNCOMPLETEDBYUSER: {
            $condition = " WHERE ExecutorID = ? AND Status != 'Done' ";
            return db_query(
                $queryPrefix . $condition, 
                [ $timestamp, $compareDirection, $limit, $userId ],
                'iiii');
        }

        default: return null;
    }

    $suffix = "";
    if ($compareDirection === DIRECTION_NEW) {
        $suffix = "ORDER BY created ASC";
    }

    return db_query(
        $queryPrefix . $condition . $suffix, 
        [ $timestamp, $compareDirection, $limit ],
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
                         $taskid
                     ],
                     'ii');
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