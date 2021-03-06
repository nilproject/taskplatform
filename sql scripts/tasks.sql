SHOW ERRORS;

DROP TABLE IF EXISTS Tasks;

CREATE TABLE Tasks (
    TaskID INT8 NOT NULL AUTO_INCREMENT,
    CreatorID INT8 NOT NULL,
    ExecutorID INT8 NULL,
    Reward DECIMAL(16,4) NOT NULL,
    Description NVARCHAR(4096),
    Status ENUM('ToDo',
			   'Assigned',
               'Done') NOT NULL,
    Created INT8 NOT NULL,
    PRIMARY KEY (TaskID)
)  ENGINE = INNODB;

create index IX_Tasks_CreatorID on Tasks(CreatorID);
create index IX_Tasks_ExecutorID on Tasks(ExecutorID);
create index IX_Tasks_Created on Tasks(Created);
