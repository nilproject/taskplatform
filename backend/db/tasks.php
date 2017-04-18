<?php

include_once "commondb.php";

const GETTASK_ALL = 0;
const GETTASK_CREATEDBYUSER = 0;
const GETTASK_UNCOMPLETED = 1;
const GETTASK_COMPLETED = 2;

function getTasks($taskType, $userId, $limit, $timestamp) {
    $queryPrefix = "SELECT taskId, creatorId, executorId, reward, description, state, created FROM Tasks";
    $querySuffix = "AND Created < ? ORDER BY TaskID DESC LIMIT ?";

    if ($taskType === GETTASK_ALL) {
        return db_query($queryPrefix . " WHERE 1 " . $querySuffix, [ $timestamp => 'i', $limit => 'i' ]);
    }

    if ($taskType === GETTASK_CREATEDBYUSER) {
        return db_query($queryPrefix . " WHERE CreatorID = ? " . $querySuffix, [ $userId => 'i', $timestamp => 'i', $limit => 'i' ]);
    }

    if ($taskType === GETTASK_UNCOMPLETED) {
        return db_query($queryPrefix . " WHERE State != 'Completed' " . $querySuffix, [ $timestamp => 'i', $limit => 'i' ]);
    }

    if ($taskType === GETTASK_UNCOMPLETED) {
        return db_query($queryPrefix . " WHERE State = 'Completed' " . $querySuffix, [ $timestamp => 'i', $limit => 'i' ]);
    }

    return null;
}

function createTask($creatorId, $description, $reward) {
    return db_query("INSERT INTO Tasks (CreatorID, Reward, Description, Created)
                     VALUES (?, ?, ?, ?)",
                     [
                         $creatorId               => 'i',
                         $reward                  => 'i',
                         $description             => 's',
                         intval(microtime(true) * 1000) => 'i'
                     ]);
}