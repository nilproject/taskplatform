<?php

include_once "commondb.php";

function getTransactions($limit, $timestamp, $compareDirection) {
    $prms = [];
    $types = "";
    $select = "SELECT transactionID, direction, sourceID, targetID, amount, created FROM Transactions";
    $timeComparision = $compareDirection === 0 ? "(Created < ?)" : "(Created > ?)";

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

    $query = $select . " WHERE " . $timeComparision . $order . " LIMIT ?";

    $link = db_connect();
    $result = db_connectedQuery($link, $query, $prms, $types);
    $resultSize = count($result);
    if ($resultSize > 0 && $resultSize === $limit) {
        $minTime = $result[$resultSize - 1]["created"];
        $prms[count($prms) - 2] = $minTime;
        $addResult = db_connectedQuery($link, $select . " WHERE (Created = ?)", $prms, $types);

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