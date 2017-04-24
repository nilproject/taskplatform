<?php

function db_query($multiquery, $params, $types, $queriesDelimiter = "GO;", &$insertedIds = null, &$affectedRowsCount = null) {
	$db = mysqli_connect($_SERVER["DB_HOST"], $_SERVER["DB_LOGIN"], $_SERVER["DB_PASS"], $_SERVER["DB_NAME"])
			        or die('dberror: ' . mysql_error());
	
	try {
		$result = array();
		$paramsIndex = 0;
		$queries = explode($queriesDelimiter, $multiquery);
		foreach ($queries as $query) {
			$prmsCount = 0;
			for ($i = 0, $len = strlen($query); $i < $len; $i++) {
				if ($query[$i] === '?')
					$prmsCount++;
			}

			$preparedQuery = mysqli_prepare($db, $query);

			if (!$preparedQuery) {
				return ["error" => "Invalid request"];
			}
			
			$localTypes = "";
			$prms = [ &$preparedQuery, &$localTypes ];
			if ($params) {
				$cvtPrms = [];
				for (; $prmsCount --> 0; $paramsIndex++) {
					$cvtPrms[] = $params[$paramsIndex];
					$localTypes .= $types[$paramsIndex];
					$prms[] = &$cvtPrms[count($cvtPrms) - 1];
				}
			}

			call_user_func_array("mysqli_stmt_bind_param", $prms);
			
			$success = mysqli_stmt_execute($preparedQuery);

			if (!$success) {
				$errorList = mysqli_error_list($db);
				$errorMessage = "";
				foreach ($errorList as $channel => $errors) {
					foreach ($errors as $key => $error) {
						$success = false;
						$errorMessage .= $key . "  " . $error . "\n";
					}
				}
				
				return array("error" => $errorMessage);
			}
			
			if ($affectedRowsCount !== null) {
				$affectedRowsCount += mysqli_affected_rows($db);
			}

			$queryResult = mysqli_stmt_get_result($preparedQuery);
			
			if (!is_bool($queryResult)) {
				while ($line = mysqli_fetch_assoc($queryResult)) {
					$result[] = $line;
				}

				mysqli_free_result($queryResult);
			}
			
			if (is_array($insertedIds)) {
				$lastInsertId = mysqli_insert_id($db);
				if ($lastInsertId !== 0) {
					$insertedIds[] = $lastInsertId;
				}
			}
		}
		
		return $result;
	}
	finally {
		mysqli_close($db);
	}
}
