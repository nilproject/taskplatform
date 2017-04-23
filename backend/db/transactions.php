<?php

include_once "commondb.php";

function getTransactions($limit, $timestamp, $compareDirection) {
    $query = "CALL getTransactions(?, ?, ?); 
              GO;
              SELECT transactionID, direction, sourceID, targetID, amount, created FROM rslt_getTransactions";
 
    return db_query(
            $query, 
            [ $timestamp, $limit, $compareDirection ],
            'iii');
}

function createTransaction($direction, $sourceId, $targetId, $amount, $part = 1.0) {
    return db_query("INSERT INTO Transactions (Direction, SourceID, TargetID, Amount, Created)
                     VALUES (?, ?, ?, ? * ?, ?)",
                     [
                         $direction,
                         $sourceId, 
                         $targetId, 
                         $amount,
                         $part,
                         now()
                     ], 
                     'siiddi');
}

function computeUserCash($userId) {
    return db_query("SELECT SUM(Amount) AS cash
                     FROM Transactions 
                     WHERE Direction IN ( 
                             'FromTaskToUser', 
                             'FromUserToUser',
                             'FromSystemToUser')
                     AND TargetID = ?",
                     [
                         $userId
                     ], 
                     'i')[0];
}