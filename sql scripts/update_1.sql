DROP TRIGGER IF EXISTS TR_ExecutorOverrideCheck;
DROP TRIGGER IF EXISTS TR_CachEnoughCheck;
DROP PROCEDURE IF EXISTS getTransactions;
DROP PROCEDURE IF EXISTS getTasks;
GRANT CREATE TEMPORARY TABLES, DROP, DELETE, UPDATE, INSERT, SELECT ON taskplatform.* TO 'taskPlatform'@'localhost';