// Controllers
import * as task_controller from '../controller';

// Models
import { Task } from '../models/Task';
import { TASK_ERRORS } from '../../non_routes/Utils/Errors_ENUM';

// Errors
import { VError } from 'verror';

// Utils
import { UnitTest_CreateTask, UnitTest_DeleteTask } from './helperMethods';
import * as Joi from '@hapi/joi'

// Unit testing
import { GetTmpUserUid } from '../../user/test/tmpUser.spec';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
chai.use(chaiAsPromised);
const assert = chai.assert;
const expect = chai.expect;

let uid: string;

describe('Task', () => {
  let task: Task;

  before('Get tmp user uid', () => {
    uid = GetTmpUserUid();
  });

  before('Create task', () => {
    return task_controller
      .CreateTask(uid, 'UnitTest task', 'test description')
      .then(result => {
        assert.notStrictEqual(typeof result, 'undefined');
        assert.notStrictEqual(result, null);
        assert.isObject(result);
        assert.instanceOf(result, Task);

        const validateResult: Joi.ValidationResult<any> = Task.ValidateObject(result);
        assert.isNull(validateResult.error);

        task = result;
      });
  });

  describe('ListTasks()', () => {
    it('Get all of users tasks', () => {
      return task_controller
        .ListAllTasksByUser(uid)
        .then(result => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isArray(result);
          assert.lengthOf(result, 1);

          result.forEach(tmpTask => {
            const validateResult: Joi.ValidationResult<any> = Task.ValidateObject(tmpTask);
            assert.isNull(validateResult.error);
          });
        });
    });
  });

  describe('RetrieveTask()', () => {
    let notOwnedTask: Task;

    before('Create not owned task', () => {
      return UnitTest_CreateTask('notMyUid').then(tmpTask => notOwnedTask = tmpTask);
    });

    it('Throws: TASK_ERRORS.could_not_find_task_on_id', () => {
      return task_controller
        .RetrieveTask(uid, 'meh')
        .then(() => { throw new Error('Should not go to THEN'); })
        .catch((result) => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, VError);
          assert.strictEqual(result.name, TASK_ERRORS.could_not_find_task_on_id);
        });
    });

    it('Throws: TASK_ERRORS.task_not_yours', () => {
      return task_controller
        .RetrieveTask(uid, notOwnedTask.uid)
        .then(() => { throw new Error('Should not go to THEN'); })
        .catch((result) => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, VError);
          assert.strictEqual(result.name, TASK_ERRORS.task_not_yours);
        });
    });

    it('Get 1 specific of users tasks', () => {
      return task_controller
        .RetrieveTask(uid, task.uid)
        .then(result => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, Task);

          const validateResult: Joi.ValidationResult<any> = Task.ValidateObject(result);
          assert.isNull(validateResult.error);
        });
    });

    after('Delete not owned Task', () => {
      return UnitTest_DeleteTask('notMyUid', notOwnedTask);
    });
  });

  describe('CreateTask()', () => {
    let tmpTask: Task;

    it('Create task', () => {
      return task_controller
        .CreateTask(uid, 'tmp Test task', 'tmp description')
        .then(result => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, Task);

          const validateResult: Joi.ValidationResult<any> = Task.ValidateObject(result);
          assert.isNull(validateResult.error);

          tmpTask = result;
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name is null', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving null as task name
        .CreateTask(uid, null, 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "name" fails because ["name" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name is undefined', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving undefined as task name
        .CreateTask(uid, undefined, 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "name" fails because ["name" is required]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name isnt strict string', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving a number as task name
        .CreateTask(uid, 123, 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "name" fails because ["name" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name is empty', () => {
      return expect(task_controller
        .CreateTask(uid, '', 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "name" fails because ["name" is not allowed to be empty, "name" length must be at least 1 characters long, "name" with value "" fails to match the required pattern: /^[ a-zA-Z0-9æøåÆØÅ\\n.,]+$/i]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name contains illegal characters', () => {
      const tmpTaskName = '!@#';
      return expect(task_controller
        .CreateTask(uid, tmpTaskName, 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', `CT CreateTask() - Schema Invalid.: child "name" fails because ["name" with value "${tmpTaskName}" fails to match the required pattern: /^[ a-zA-Z0-9æøåÆØÅ\\n.,]+$/i]`);
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name is longer than 30 characters', () => {
      return expect(task_controller
        .CreateTask(uid, 'Very Long Unit Test Task Name which is very long', 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', `CT CreateTask() - Schema Invalid.: child "name" fails because ["name" length must be less than or equal to 30 characters long]`);
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because userId is null', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving null as userId
        .CreateTask(null, 'tmp Test task', 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "ownerUid" fails because ["ownerUid" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because userId is undefined', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving undefined as userId
        .CreateTask(undefined, 'tmp Test task', 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "ownerUid" fails because ["ownerUid" is required]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because userId isnt strict string', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving a number as userId
        .CreateTask(123, 'tmp Test task', 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "ownerUid" fails because ["ownerUid" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because userId is empty', () => {
      return expect(task_controller
        .CreateTask('', 'tmp Test task', 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "ownerUid" fails because ["ownerUid" is not allowed to be empty, "ownerUid" length must be at least 1 characters long, "ownerUid" must only contain alpha-numeric characters]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because userId contains illegal characters', () => {
      const tmpOwner = '!@#';
      return expect(task_controller
        .CreateTask(tmpOwner, 'tmp Test task', 'test description'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "ownerUid" fails because ["ownerUid" must only contain alpha-numeric characters]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description is null', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving null as task description
        .CreateTask(uid, 'test name', null))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "description" fails because ["description" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description is undefined', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving undefined as task description
        .CreateTask(uid, 'test name', undefined))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "description" fails because ["description" is required]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description isnt strict string', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving a number as task description
        .CreateTask(uid, 'test name', 123))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "description" fails because ["description" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description is empty', () => {
      return expect(task_controller
        .CreateTask(uid, 'test name', ''))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT CreateTask() - Schema Invalid.: child "description" fails because ["description" is not allowed to be empty, "description" length must be at least 1 characters long, "description" with value "" fails to match the required pattern: /^[ a-zA-Z0-9æøåÆØÅ\\n.,]+$/i]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description contains illegal characters', () => {
      const tmpTaskDescription = '!@#';
      return expect(task_controller
        .CreateTask(uid, 'test name', tmpTaskDescription))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', `CT CreateTask() - Schema Invalid.: child "description" fails because ["description" with value "${tmpTaskDescription}" fails to match the required pattern: /^[ a-zA-Z0-9æøåÆØÅ\\n.,]+$/i]`);
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description is longer than 250 characters', () => {
      return expect(task_controller
        .CreateTask(uid, 'test name', 'Very Long Unit Test Task Description which is very long Very Long Unit Test Task Description which is very long Very Long Unit Test Task Description which is very long Very Long Unit Test Task Description which is very long Very Long Unit Test Task Description which is very long'))
        .to.eventually.be.rejectedWith('CT CreateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', `CT CreateTask() - Schema Invalid.: child "description" fails because ["description" length must be less than or equal to 250 characters long]`);
        });
    });

    after('Delete task', () => {
      return task_controller.DeleteTask(uid, tmpTask.uid);
    });
  });

  describe('UpdateTask()', () => {
    let notOwnedTask: Task;

    before('Create not owned task', () => {
      return UnitTest_CreateTask('notMyUid').then(tmpTask => notOwnedTask = tmpTask);
    });

    it('Throw: TASK_ERRORS.could_not_find_task_on_id', () => {
      return task_controller
        .UpdateTask(uid, 'unknownId', 'meh', 'test description')
        .then(() => { throw new Error('Should not go to THEN'); })
        .catch((result) => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, VError);
          assert.strictEqual(result.name, TASK_ERRORS.could_not_find_task_on_id);
        });
    });

    it('Throw: TASK_ERRORS.task_not_yours', () => {
      return task_controller
        .UpdateTask(uid, notOwnedTask.uid, 'updated name', 'test description')
        .then(() => { throw new Error('Should not go to THEN'); })
        .catch((result) => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, VError);
          assert.strictEqual(result.name, TASK_ERRORS.task_not_yours);
        });
    });

    it('Update task', () => {
      assert.notStrictEqual(task.name, 'Test task updated');
      assert.notStrictEqual(task.name, 'test description');

      return task_controller
        .UpdateTask(uid, task.uid, 'Test task updated', 'test description')
        .then(result => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, Task);

          const validateResult: Joi.ValidationResult<any> = Task.ValidateObject(result);
          assert.isNull(validateResult.error);

          const tmpTask = result;

          assert.strictEqual(tmpTask.name, 'Test task updated');
          assert.strictEqual(tmpTask.description, 'test description');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name is null', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving null as task name
        .UpdateTask(uid, task.uid, null, 'test description'))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT UpdateTask() - Schema Invalid.: child "name" fails because ["name" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name is undefined', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving undefined as task name
        .UpdateTask(uid, task.uid, undefined, 'test description'))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT UpdateTask() - Schema Invalid.: child "name" fails because ["name" is required]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name isnt strict string', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving a number as task name
        .UpdateTask(uid, task.uid, 123, 'test description'))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT UpdateTask() - Schema Invalid.: child "name" fails because ["name" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name is empty', () => {
      return expect(task_controller
        .UpdateTask(uid, task.uid, '', 'test description'))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT UpdateTask() - Schema Invalid.: child "name" fails because ["name" is not allowed to be empty, "name" length must be at least 1 characters long, "name" with value "" fails to match the required pattern: /^[ a-zA-Z0-9æøåÆØÅ\\n.,]+$/i]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name contains illegal characters', () => {
      const tmpTaskName = '!@#';
      return expect(task_controller
        .UpdateTask(uid, task.uid, tmpTaskName, 'test description'))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', `CT UpdateTask() - Schema Invalid.: child "name" fails because ["name" with value "${tmpTaskName}" fails to match the required pattern: /^[ a-zA-Z0-9æøåÆØÅ\\n.,]+$/i]`);
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because name is longer than 30 characters', () => {
      return expect(task_controller
        .UpdateTask(uid, task.uid, 'Very Long Unit Test Task Name which is very long', 'test description'))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', `CT UpdateTask() - Schema Invalid.: child "name" fails because ["name" length must be less than or equal to 30 characters long]`);
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description is null', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving null as task description
        .UpdateTask(uid, task.uid, 'test name', null))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT UpdateTask() - Schema Invalid.: child "description" fails because ["description" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description is undefined', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving undefined as task description
        .UpdateTask(uid, task.uid, 'test name', undefined))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT UpdateTask() - Schema Invalid.: child "description" fails because ["description" is required]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description isnt strict string', () => {
      return expect(task_controller
        // @ts-ignore Ignore the error that we're giving a number as task description
        .UpdateTask(uid, task.uid, 'test name', 123))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT UpdateTask() - Schema Invalid.: child "description" fails because ["description" must be a string]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description is empty', () => {
      return expect(task_controller
        .UpdateTask(uid, task.uid, 'test name', ''))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', 'CT UpdateTask() - Schema Invalid.: child "description" fails because ["description" is not allowed to be empty, "description" length must be at least 1 characters long, "description" with value "" fails to match the required pattern: /^[ a-zA-Z0-9æøåÆØÅ\\n.,]+$/i]');
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description contains illegal characters', () => {
      const tmpTaskdescription = '!@#';
      return expect(task_controller
        .UpdateTask(uid, task.uid, 'test name', tmpTaskdescription))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', `CT UpdateTask() - Schema Invalid.: child "description" fails because ["description" with value "${tmpTaskdescription}" fails to match the required pattern: /^[ a-zA-Z0-9æøåÆØÅ\\n.,]+$/i]`);
        });
    });

    it('Throws TASK_ERRORS.schema_invalid because description is longer than 250 characters', () => {
      return expect(task_controller
        .UpdateTask(uid, task.uid, 'test name', 'Very Long Unit Test Task Description which is very long Very Long Unit Test Task Description which is very long Very Long Unit Test Task Description which is very long Very Long Unit Test Task Description which is very long Very Long Unit Test Task Description which is very long'))
        .to.eventually.be.rejectedWith('CT UpdateTask() - Schema Invalid')
        .then(err => {
          expect(err).to.be.instanceOf(VError);
          expect(err).to.have.property('name', TASK_ERRORS.schema_invalid);
          expect(err).to.have.property('message', `CT UpdateTask() - Schema Invalid.: child "description" fails because ["description" length must be less than or equal to 250 characters long]`);
        });
    });

    after('Delete not owned Task', () => {
      return UnitTest_DeleteTask('notMyUid', notOwnedTask);
    });
  });

  describe('DeleteTask()', () => {
    let notOwnedTask: Task;

    before('Create not owned task', () => {
      return UnitTest_CreateTask('notMyUid').then(tmpTask => notOwnedTask = tmpTask);
    });

    it('Throw: TASK_ERRORS.could_not_find_task_on_id', () => {
      return task_controller
        .DeleteTask(uid, 'unknownId')
        .then(() => { throw new Error('Should not go to THEN'); })
        .catch((result) => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, VError);
          assert.strictEqual(result.name, TASK_ERRORS.could_not_find_task_on_id);
        });
    });

    it('Throw: TASK_ERRORS.task_not_yours', () => {
      return task_controller
        .DeleteTask(uid, notOwnedTask.uid)
        .then(() => { throw new Error('Should not go to THEN'); })
        .catch((result) => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, VError);
          assert.strictEqual(result.name, TASK_ERRORS.task_not_yours);
        });
    });

    it('Delete task', () => {
      return task_controller.DeleteTask(uid, task.uid);
    });

    after('Delete not owned Task', () => {
      return UnitTest_DeleteTask('notMyUid', notOwnedTask);
    });
  });
});