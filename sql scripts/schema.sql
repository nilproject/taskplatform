CREATE SCHEMA `taskplatform` ;
CREATE USER 'taskPlatform'@'localhost';
GRANT CREATE TEMPORARY TABLES, DROP, DELETE, UPDATE, INSERT, SELECT ON taskplatform.* TO 'taskPlatform'@'localhost';
