// Controllers
import * as user_controller from '../controller';

// Models
import { User } from '../models/User';
import { USER_ERRORS } from '../../non_routes/Utils/Errors_ENUM';

// Errors
import { VError } from 'verror';

// Utils
import * as Joi from '@hapi/joi'

// Unit testing
import { GetTmpUserUid } from '../../user/test/tmpUser.spec';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
chai.use(chaiAsPromised);
const assert = chai.assert;

let uid: string;

describe('User', () => {

  before('Get tmp user uid', () => {
    uid = GetTmpUserUid();
  });

  describe('RetrieveUserOnUid()', function () {
    it('Return user', () => {
      return user_controller
        .RetrieveUserOnUid(uid)
        .then(result => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, User);

          const validateResult: Joi.ValidationResult<any> = User.ValidateObject(result);
          assert.isNull(validateResult.error);
        });
    });

    it('Throws USER_ERRORS.user_not_found because user not exist', () => {
      return user_controller
        .RetrieveUserOnUid('meh')
        .then(() => { throw new Error('Should not go to THEN'); })
        .catch((result) => {
          assert.notStrictEqual(typeof result, 'undefined');
          assert.notStrictEqual(result, null);
          assert.isObject(result);
          assert.instanceOf(result, VError);
          assert.strictEqual(result.name, USER_ERRORS.user_not_found);
        });
    });
  });
});