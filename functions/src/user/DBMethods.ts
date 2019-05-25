// Firebase
import * as admin from 'firebase-admin';

// Models
import { User } from './models/User';

// Errors
import { VError } from 'verror';
import * as logger from '../non_routes/Utils/logger';
import * as DefaultErrors from '../non_routes/Utils/Errors_ENUM';
import assert = require('assert');

// DB
const db_firestore = admin.firestore();
const ref_users = db_firestore.collection('users');


/**
 * @description Set up user account
 * @param {User} user
 * @returns {Promise<void>} Promise<void>
 * @throws {VError} DefaultErrors.ERRORS.unknown
 */
export const UserCreationSetup = (user: User): Promise<void> => {
    logger.debug(`DB UserCreationSetup()`);

    assert.notStrictEqual(typeof user, 'undefined');
    assert.notStrictEqual(user, null);

    const ref_newUser = ref_users.doc(user.uid);

    return admin
        .firestore()
        .runTransaction(transaction => {
            return transaction
                .get(ref_newUser)
                .then(userDoc => {
                    transaction.create(ref_newUser, user.ToDB()); // Rejects if doc already exists
                });
        })
        .then(() => {
            return;
        })
        .catch((err) => {
            let error = err;
            if ((error instanceof VError) === false) {
                error = new VError(err, 'DB UserCreationSetup() - Caught Unknown Error.');
                error.name = DefaultErrors.ERRORS.unknown;
            }
            logger.error(error);
            throw error;
        });
}

/**
 * @description Does user exist on user uid
 * @param {string} userUid 
 * @returns {Promise<boolean>}
 * @throws {VError} DefaultErrors.ERRORS.unknown
 */
export const DoesUserExistOnUid = async (userUid: string): Promise<boolean> => {
    logger.debug(`DB DoesUserExistOnUid()`);

    assert.notStrictEqual(userUid, null);
    assert.strictEqual(typeof userUid, 'string');

    try {
        const doc = await ref_users
            .doc(userUid)
            .get();
        return doc.exists;
    }
    catch (err) {
        const newError = new VError(err, 'DB DoesUserExistOnUid() - Caught Unknown Error.');
        newError.name = DefaultErrors.ERRORS.unknown;
        logger.error(newError);
        throw newError;
    }
}

/**
 * @description Retrieves user on user uid
 * @param {string} userUid
 * @returns {(Promise<User | null>)} Promise<User | null>
 * @throws {VError} DefaultErrors.ERRORS.unknown
 */
export const RetrieveUserOnUid = async (userUid: string): Promise<User | null> => {
    logger.debug(`DB RetrieveUserOnUid()`);

    assert.strictEqual(typeof userUid, 'string');
    assert.notStrictEqual(userUid, null);

    try {
        const documentSnapshot = await ref_users
            .doc(userUid)
            .get();

        if (documentSnapshot.exists === false) {
            return null;
        }

        const data = documentSnapshot.data();

        if (typeof data === 'undefined') {
            return null;
        }

        return User.ConstructFromData(data);
    }
    catch (err) {
        const newError = new VError(err, 'DB RetrieveUserOnUid() - Caught Unknown Error.');
        newError.name = DefaultErrors.ERRORS.unknown;
        logger.error(newError);
        throw newError;
    }
}