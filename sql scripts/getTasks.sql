DROP PROCEDURE IF EXISTS getTasks;

DELIMITER //
CREATE PROCEDURE getTasks(timestamp INT8, `limit` INT, compareDirection INT)
BEGIN
	DROP TABLE IF EXISTS tmp_temp; 
	DROP TABLE IF EXISTS tmp_temp2; 
	DROP TABLE IF EXISTS rslt_taskList; 
	
    CREATE TEMPORARY TABLE tmp_temp 
	SELECT * 
	FROM Tasks 
	WHERE (compareDirection = 0 AND (Created < timestamp)) || (compareDirection != 0 AND (Created > timestamp))
	ORDER BY Created DESC 
	LIMIT `limit`; 
    
    SET @created = (SELECT MIN(Created) FROM tmp_temp); 
	
    CREATE TEMPORARY TABLE tmp_temp2 
	SELECT *
	FROM Tasks 
	WHERE Created = @created; 
    
    CREATE TEMPORARY TABLE rslt_taskList 
	SELECT * 
	FROM tmp_temp
	WHERE created != @created 
	UNION ALL 
	SELECT * 
    FROM tmp_temp2;
END;
//