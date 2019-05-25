import * as Joi from '@hapi/joi'
import * as chaiImport from 'chai';
const assert = chaiImport.assert;

import * as task_controller from '../controller';
import { Task } from '../models/Task';

/**
 * @description Creates task with name UnitTest
 */
export function UnitTest_CreateTask(tmpUserUid: string): Promise<Task> {
  return task_controller
    .CreateTask(tmpUserUid, 'UnitTest', 'test description')
    .then(task => {
      assert.notStrictEqual(typeof task, 'undefined');
      assert.notStrictEqual(task, null);
      assert.isObject(task);
      assert.instanceOf(task, Task);

      const validateResult: Joi.ValidationResult<any> = Task.ValidateObject(task);
      assert.isNull(validateResult.error);

      return task;
    });
}

/**
 * @description Deletes task
 */
export function UnitTest_DeleteTask(tmpUid: string, task: Task) {
  return task_controller.DeleteTask(tmpUid, task.uid);
}