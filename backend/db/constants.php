<?php

const ROLE_EXECUTOR = 'Executor';
const ROLE_CUSTOMER = 'Customer';
const ROLE_SYSTEM   = 'System';

const TASKSTATUS_COMPLETED = 'Done';
const TASKSTATUS_ASSIGNED  = 'Assigned';
const TASKSTATUS_TODO   = 'ToDo';

const GETTASK_ALL = 0;
const GETTASK_CREATEDBYUSER = 1;
const GETTASK_UNCOMPLETED = 2;
const GETTASK_COMPLETED = 3;
const GETTASK_ASSIGNEDTOUSER = 4;
const GETTASK_COMPLETEDBYUSER = 5;

const DIRECTION_OLD = 0;
const DIRECTION_NEW = 1;

const USER_SYSTEM = 1;

const TRANSACTION_DIRECTION_FromUserToTask = 'FromUserToTask';
const TRANSACTION_DIRECTION_FromTaskToUser = 'FromTaskToUser';
const TRANSACTION_DIRECTION_FromUserToUser = 'FromUserToUser';
const TRANSACTION_DIRECTION_FromUserToSystem = 'FromUserToSystem';
const TRANSACTION_DIRECTION_FromTaskToSystem = 'FromTaskToSystem';
const TRANSACTION_DIRECTION_FromSystemToUser = 'FromSystemToUser';
