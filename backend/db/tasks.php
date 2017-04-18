<?php

include_once "commondb.php";

const GETTASK_ALL = 0;
const GETTASK_CREATEDBYUSER = 1;
const GETTASK_UNCOMPLETED = 2;
const GETTASK_COMPLETED = 3;
const GETTASK_ASSIGNEDTOUSER = 4;
const GETTASK_COMPLETEDBYUSER = 5;

function getTasks($taskType, $userId, $limit, $timestamp) {
    $queryPrefix = "SELECT taskId, creatorId, executorId, reward, description, status, created FROM Tasks";
    $querySuffix = "AND Created < ? ORDER BY TaskID DESC LIMIT ?";
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
                $queryPrefix . $condition . $querySuffix, 
                [ $timestamp, $userId, $limit ],
                'iii');
        }

        case GETTASK_COMPLETEDBYUSER: {
            $condition = " WHERE ExecutorID = ? AND Status = 'Done' ";
            return db_query(
                $queryPrefix . $condition . $querySuffix, 
                [ $timestamp, $userId, $limit ],
                'iii');
        }

        case GETTASK_UNCOMPLETEDBYUSER: {
            $condition = " WHERE ExecutorID = ? AND Status != 'Done' ";
            return db_query(
                $queryPrefix . $condition . $querySuffix, 
                [ $timestamp, $userId, $limit ],
                'iii');
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

function completeTask($userId, $taskid) {
    return db_query("UPDATE Tasks
                     SET ExecutorID = ?, Status = 'Done'
                     WHERE TaskID = ?",
                     [
                         $userId,
                         $taskid,
                     ],
                     'ii');
}