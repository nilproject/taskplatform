<?php

function db_query($query, $params) {
    $db = mysqli_connect($_SERVER["DB_HOST"], $_SERVER["DB_LOGIN"], $_SERVER["DB_PASS"], $_SERVER["DB_NAME"])
        or die('dberror: ' . mysql_error());    

    try {
        $preparedQuery = mysqli_prepare($db, $query);
        
        $types = "";
        $prms = array(&$preparedQuery, &$types);
        $cvtPrms = array();
        foreach ($params as $value => $type) {
            $types .= $type;
            if ($type === 'i') {
                $cvtPrms[] = intval($value);
                $prms[] = &$cvtPrms[count($cvtPrms) - 1];
            } else {
                $prms[] = &$value;
            }
        }

        call_user_func_array("mysqli_stmt_bind_param", $prms);

        mysqli_stmt_execute($preparedQuery);
        $queryResult = mysqli_stmt_get_result($preparedQuery);
        
        $errorList = mysqli_error_list($db);
        $success = true;
        $errorMessage = "";
        foreach ($errorList as $channel => $errors) {
            foreach ($errors as $key => $error) {
                $success = false;
                $errorMessage .= $key . "  " . $error . "\n";
            }
        }

        if (!$success)
            return array("error" => $errorMessage);

        $result = array();
        while ($line = mysqli_fetch_assoc($queryResult)) {
            $result[] = $line;
        }
        mysqli_free_result($queryResult);

        return $result;
    } finally {
        mysqli_close($db);
    }
}