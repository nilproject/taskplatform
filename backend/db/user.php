<?php

include_once "commondb.php";

function getUserInfo($userId) {
    return db_query('SELECT userId, vkUserId, `name`, role, cash FROM Users 
                     WHERE UserID = ?',
                     [
                         $userId
                     ],
                     'i')[0];   
}

// Internal call only!
function getUsers($userIds) {
    $ids = "";

    foreach ($userIds as $key => $value) {
        if ($ids !== "")
            $ids .= ",";

        $ids .= intval($value);
    }

    return db_query('SELECT userId, vkUserId, `name`, role, cash FROM Users 
                     WHERE UserID IN (' . $ids . ")", [], "");
}

function getUserRole($userId) {
    return db_query('SELECT role FROM Users 
                     WHERE UserID = ?',
                     [
                         $userId
                     ],
                     'i')[0];   
}

function getUserIdByVkId($vkUserId) {
    return db_query('SELECT userId
                     FROM Users 
                     WHERE VkUserID = ?',
                     [
                         $vkUserId
                     ],
                     'i')[0];
}

function isAdmin($userId) {
    return db_query('SELECT Admin
                     FROM Users 
                     WHERE UserID = ?',
                     [
                         $userId
                     ],
                     'i')[0]['Admin'] === 1;
}

function createUser($vkUserId, $role, $name, $isAdmin, &$userId) {
    $userIds = [];
    $result = db_query('INSERT INTO Users (VkUserID, `Name`, Role, Cash, Admin) 
                     VALUES (?, ?, ?, 0, ?)',
                     [
                         $vkUserId,
                         $name,
                         $role,
                         $isAdmin ? 1 : 0
                     ],
                     'issi',
                     "GO;",
                     $userIds);
    
    if (array_key_exists(0, $userIds))
        $userId = $userIds[0];

    return $result;
}

function tryWithdrawFunds($userId, $amount) {
    if (!is_numeric($amount) || doubleval($amount) < 0) {
        die("Incorrect amount");
    }

    $insertdRows = null;
    $affectedRowsCount = 0;
    $response = db_query('UPDATE Users 
                     SET Cash = Cash - ? 
                     WHERE UserID = ? AND Cash >= ?',
                     [
                         $amount,
                         $userId,
                         $amount
                     ],
                     'sis',
                     'GO;',
                     $insertdRows,
                     $affectedRowsCount);
    checkResponse($response);
    return $affectedRowsCount !== 0;
}

function enrollFunds($userId, $amount) {
    if (!is_numeric($amount) || doubleval($amount) < 0) {
        die("Incorrect amount");
    }

    return db_query('UPDATE Users 
                     SET Cash = Cash + ? 
                     WHERE UserID = ?',
                     [
                         $amount,
                         $userId
                     ],
                     'si');
}

function deleteUser($userId) {
    return db_query("DELETE FROM Users 
                     WHERE UserID = ?",
                     [
                         $userId
                     ],
                     'i');
}