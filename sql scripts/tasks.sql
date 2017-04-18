SHOW ERRORS;

DROP TABLE IF EXISTS Tasks;

CREATE TABLE Tasks (
    TaskID INT8 NOT NULL AUTO_INCREMENT,
    CreatorID INT8 NOT NULL,
    ExecutorID INT8 NULL,
    Reward DECIMAL NOT NULL,
    Description NVARCHAR(4096),
    State ENUM('Created',
			   'Assigned',
               'Completed') NOT NULL,
    Created INT8 NOT NULL,
    PRIMARY KEY (TaskID)
)  ENGINE=INNODB;

create index IX_Tasks_CreatorID on Tasks(CreatorID);
create index IX_Tasks_ExecutorID on Tasks(ExecutorID);
create index IX_Tasks_Created on Tasks(Created);

DELIMITER //
create trigger TR_ExecutorOverrideCheck before update on Tasks
for each row
begin
	if OLD.ExecutorID IS NOT NULL AND NEW.ExecutorID != OLD.ExecutorID then
		set @msg = 'Error: Excecutor is already assigned';
		signal sqlstate '45000' set message_text = @msg;
	end if;
end
//
