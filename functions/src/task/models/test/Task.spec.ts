import * as chaiImport from 'chai';
const assert = chaiImport.assert;

import * as Joi from '@hapi/joi'
import { Task } from '../Task';
import { ITask } from '../shared/ITask';


describe('Task', () => {
  let task: Task;

  before('Create task object', () => {
    task = new Task('testUid', 'testOwnerUid', 'testName', 'testDescription', undefined);
  });

  describe('Task ctor', () => {
    it('uid should be testUid', () => {
      assert.strictEqual(task.uid, 'testUid');
    });

    it('ownerUid should be testOwnerUid', () => {
      assert.strictEqual(task.ownerUid, 'testOwnerUid');
    });

    it('name should be testName', () => {
      assert.strictEqual(task.name, 'testName');
    });

    it('description should be testDescription', () => {
      assert.strictEqual(task.description, 'testDescription');
    });

    it('creationDateUtcIso should be undefined', () => {
      assert.isUndefined(task.creationDateUtcIso);
    });
  });

  describe('uid', () => {
    it('uid should be string', () => {
      assert.typeOf(task.uid, 'string');
    });
  });

  describe('ownerUid', () => {
    it('ownerUid should be string', () => {
      assert.typeOf(task.ownerUid, 'string');
    });
  });

  describe('name', () => {
    it('name should be string', () => {
      assert.typeOf(task.name, 'string');
    });
  });

  describe('description', () => {
    it('description should be string', () => {
      assert.typeOf(task.description, 'string');
    });
  });

  describe('creationDateUtcIso', () => {
    it('creationDateUtcIso should be undefined', () => {
      assert.isUndefined(task.creationDateUtcIso);
    });
  });
});

describe('ConstructFromData()', () => {
  it('returns Task', () => {
    const tmpObj: ITask = {
      uid: 'randomUid',
      ownerUid: 'randomOwnerUid',
      name: 'random task Name',
      description: 'random task description',
      creationDateUtcIso: undefined
    }

    const result = Task.ConstructFromData(tmpObj);

    assert.isNotNull(result);
    assert.instanceOf(result, Task);
  });

  it('returns null because invalid data', () => {
    const result = Task.ConstructFromData({
      uid: 123,
      ownerUid: 'randomOwnerUid',
      name: 'random task Name',
      description: 'random task description',
      creationDateUtcIso: undefined
    });

    assert.isNull(result);
  });
});

describe('ValidateObject()', () => {
  const runs = [
    {
      it: 'Missing all properties',
      data: {
      }
    },
    {
      it: 'Missing ownerUid',
      data: {
        uid: 'randomUid',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },    
    {
      it: 'Missing name',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        description: 'randomDescription'
      }
    },
    {
      it: 'Missing description',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: 'random task Name'
      }
    },
    {
      it: 'uid is not string',
      data: {
        uid: 123,
        ownerUid: 'randomOwnerUid',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'uid is null',
      data: {
        uid: null,
        ownerUid: 'randomOwnerUid',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'uid is empty',
      data: {
        uid: '',
        ownerUid: 'randomOwnerUid',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'uid is only space',
      data: {
        uid: ' ',
        ownerUid: 'randomOwnerUid',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'uid is only spaces',
      data: {
        uid: '   ',
        ownerUid: 'randomOwnerUid',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'uid contains text with spaces',
      data: {
        uid: 'random Uid',
        ownerUid: 'randomOwnerUid',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'name is not string',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: 123,
        description: 'randomDescription'
      }
    },
    {
      it: 'name is undefined',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: undefined,
        description: 'randomDescription'
      }
    },
    {
      it: 'name is null',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: null,
        description: 'randomDescription'
      }
    },
    {
      it: 'name is empty',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: '',
        description: 'randomDescription'
      }
    },
    {
      it: 'name is only space',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: ' ',
        description: 'randomDescription'
      }
    },
    {
      it: 'name is only spaces',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: '   ',
        description: 'randomDescription'
      }
    },
    {
      it: 'name contains invalid characters',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: '!@#$%^&*()-_+{}[]\\|\"\'<>/?*+',
        description: 'randomDescription'
      }
    },
    {
      it: 'ownerUid is not string',
      data: {
        uid: 'randomUid',
        ownerUid: 123,
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'ownerUid is undefined',
      data: {
        uid: 'randomUid',
        ownerUid: undefined,
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'ownerUid is null',
      data: {
        uid: 'randomUid',
        ownerUid: null,
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'ownerUid is empty',
      data: {
        uid: 'randomUid',
        ownerUid: '',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'ownerUid is only space',
      data: {
        uid: 'randomUid',
        ownerUid: ' ',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'ownerUid is only spaces',
      data: {
        uid: 'randomUid',
        ownerUid: '   ',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'ownerUid contains text with spaces',
      data: {
        uid: 'randomUid',
        ownerUid: 'random owner uid',
        name: 'random task Name',
        description: 'randomDescription'
      }
    },
    {
      it: 'description is not string',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: 'randomName',
        description: 123
      }
    },
    {
      it: 'description is undefined',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: 'randomName',
        description: undefined
      }
    },
    {
      it: 'description is null',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: 'randomName',
        description: null
      }
    },
    {
      it: 'description is empty',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: 'randomName',
        description: ''
      }
    },
    {
      it: 'description is only space',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: 'randomName',
        description: ' '
      }
    },
    {
      it: 'description is only spaces',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: 'randomName',
        description: '   '
      }
    },
    {
      it: 'description contains invalid characters',
      data: {
        uid: 'randomUid',
        ownerUid: 'randomOwnerUid',
        name: 'randomName',
        description: '!@#$%^&*()-_+{}[]\\|\"\'<>/?*+'
      }
    },
  ];

  // Run test data through validation
  runs.forEach(function (run) {
    it(run.it, function () {
      const result: Joi.ValidationResult<any> = Task.ValidateObject(run.data);

      const errors = result.error.details;

      assert.isArray(errors);
      assert.isAtLeast(errors.length, 1, errors.map(tmpErr => tmpErr.message + '\n').toString());
    });
  });


  it('Valid data', function () {
    const result: Joi.ValidationResult<any> = Task.ValidateObject({
      uid: 'randomUid',
      ownerUid: 'randomOwnerUid',
      name: 'random task Name',
      description: 'randomDescription'
    });

    assert.isNull(result.error);
  });
});

describe('toDB()', () => {
  const task = new Task('randomUid', 'randomOwnerUid', 'random task Name', 'random description');
  let tmpJson: {};

  before(() => {
    tmpJson = task.ToDB();
  });

  it('Check JSON got all keys', () => {
    assert.hasAllKeys(tmpJson, ['ownerUid', 'name', 'description', 'creationDateUtcIso']);
  });
});