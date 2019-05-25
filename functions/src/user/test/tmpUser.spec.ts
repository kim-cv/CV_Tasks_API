// Firebase
import * as admin from 'firebase-admin';

// Controllers
import * as user_controller from '../../user/controller';

// Unit testing
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
chai.use(chaiAsPromised);

let tmpUserUid: string;

export const GetTmpUserUid = () => {
  return tmpUserUid;
}

before('Create tmp user', () => {
  return admin
    .auth()
    .createUser({
      email: 'unittest@exampleunittest.com',
      emailVerified: false,
      password: 'secretPassword',
      displayName: 'John Doe',
      disabled: false
    })
    .then(userRecord => {
      tmpUserUid = userRecord.uid;
      return user_controller.UserCreationSetup(userRecord.uid, 'John', 'Doe');
    });
});

after('Delete tmp user', () => {
  return admin
    .auth()
    .deleteUser(tmpUserUid)
    .then(() => {
      const db_firestore = admin.firestore();
      const ref_users = db_firestore.collection('users');
      return ref_users.doc(tmpUserUid).delete();
    })
    .then(() => {
      // @ts-ignore TS does not allow tmpUserUid to become undefined.
      tmpUserUid = undefined;
    });
});

after('Teardown', () => {
  // Teardown all firebase app initializations locally.
  console.log('Teardown');  
  // Remove null apps from admin.apps array
  const localApps = admin.apps.filter(isNotNull);
  // Delete every app - does not delete on firebase, this delete() method just releases local resources from memory and so on.
  return Promise.all(localApps.map(app => app.delete()));
});

//  Not null, typeguard
function isNotNull<T>(argument: T | null): argument is T {
  return argument !== null;
}