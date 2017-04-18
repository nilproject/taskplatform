<?php

include_once "commondb.php";

const GETTASK_ALL = 0;
const GETTASK_CREATEDBYUSER = 0;
const GETTASK_UNCOMPLETED = 1;
const GETTASK_COMPLETED = 2;

function getTasks($taskType, $userId, $limit, $timestamp) {
    $queryPrefix = "SELECT taskId, creatorId, executorId, reward, description, state, created FROM Tasks";
    $querySuffix = "AND Created < ? ORDER BY TaskID LIMIT ?";
    $condition   = "";
    
    switch ($taskType) {
        case GETTASK_CREATEDBYUSER: {
            return db_query(
                $queryPrefix . " WHERE CreatorID = ? " . $querySuffix, 
                [ $userId, $timestamp, $limit],
                'iii');    
        }

        case GETTASK_ALL: {
            $condition = " WHERE 1 ";
            break;
        }

        case GETTASK_UNCOMPLETED: {
            $condition = " WHERE State != 'Completed' ";
            break;
        }

        case GETTASK_COMPLETED: {
            $condition = " WHERE State = 'Completed' ";
            break;
        }

        default: return null;
    }

    return db_query(
        $queryPrefix . $condition . $querySuffix, 
        [ $timestamp, $limit ],
        'ii');
}

function createTask($creatorId, $description, $reward) {
    return db_query("INSERT INTO Tasks (CreatorID, Reward, Description, Created)
                     VALUES (?, ?, ?, ?)",
                     [
                         $creatorId,
                         $reward,
                         $description,
                         intval(microtime(true) * 1000)
                     ], 
                     'iisi');
}

function completeTask($userid, $taskid) {
    return db_query("UPDATE Tasks
                     SET ExecutorID = ?
                     WHERE TaskID = ?",
                     [
                         $userId,
                         $taskid,
                     ],
                     'ii');
}