// Firebase
import * as admin from 'firebase-admin';

// ExpressJS
import { Request, Response } from 'express';

// DB
import * as UserDBMethods from './DBMethods';

// Models
import { User } from './models/User';

// Error
import { VError } from 'verror';
import * as logger from '../non_routes/Utils/logger';
import * as DefaultErrors from '../non_routes/Utils/Errors_ENUM';

// Utils
import * as assert from 'assert';


// #region Authing
/**
 * @description ValidateAuthHeaders
 * @param {Request} req
 * @returns {Promise<string>} Promise<string>
 * @throws VError AUTH_ERRORS.auth_missing_headers
 * @throws VError AUTH_ERRORS.auth_missing_authorization
 * @throws VError AUTH_ERRORS.auth_authorization_is_array
 * @throws VError AUTH_ERRORS.auth_authorization_not_starting_with_bearer
 * @throws VError AUTH_ERRORS.auth_failed
 */
async function ValidateAuthHeaders(req: Request): Promise<string> {
    if (typeof req.headers === 'undefined' || req.headers === null) {
        // req.headers not present
        const tmpError = new VError(`CT ValidateAuthHeaders() - req.headers not present.`);
        tmpError.name = DefaultErrors.AUTH_ERRORS.auth_missing_headers;
        throw tmpError;
    }
    if (typeof req.headers.authorization === 'undefined' || req.headers.authorization === null) {
        // req.headers.authorization not present
        const tmpError = new VError(`CT ValidateAuthHeaders() - req.headers.authorization not present.`);
        tmpError.name = DefaultErrors.AUTH_ERRORS.auth_missing_authorization;
        throw tmpError;
    }
    if (Array.isArray(req.headers.authorization) === true) {
        // req.headers.authorization is array, we not like
        const tmpError = new VError(`CT ValidateAuthHeaders() - req.headers.authorization is array.`);
        tmpError.name = DefaultErrors.AUTH_ERRORS.auth_authorization_is_array;
        throw tmpError;
    }
    if (req.headers.authorization.startsWith('Bearer ') === false) {
        const tmpError = new VError(`CT ValidateAuthHeaders() - req.headers.authorization is not starting with Bearer.`);
        tmpError.name = DefaultErrors.AUTH_ERRORS.auth_authorization_not_starting_with_bearer;
        throw tmpError;
    } else {
        // Bearer is present
        const authorization = req.headers.authorization;
        const splittedBearer: string[] = authorization.split('Bearer ');

        // Check if formatted as "Bearer token"
        if (splittedBearer.length !== 2) {
            // Authorization didnt format as "Bearer token"
            const tmpError = new VError(`CT ValidateAuthHeaders() - Authorization not formatted correctly: ${authorization}`);
            tmpError.name = DefaultErrors.AUTH_ERRORS.auth_failed;
            throw tmpError;
        }

        const token: string = splittedBearer[1];
        if (typeof token === 'undefined' || token === null) {
            // Token either undefined or null
            const tmpError = new VError(`CT ValidateAuthHeaders() - Token either null or undefined: ${token}`);
            tmpError.name = DefaultErrors.AUTH_ERRORS.auth_failed;
            throw tmpError;
        }

        // Return token
        return token;
    }
}

/**
 * @description VerifyIdToken
 * @param {string} token
 * @returns {Promise<admin.auth.DecodedIdToken>} Promise<admin.auth.DecodedIdToken>
 * @throws VError AUTH_ERRORS.auth_failed
 */
async function VerifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    assert.notStrictEqual(token, null);
    assert.strictEqual(typeof token, 'string');

    return admin
        .auth()
        .verifyIdToken(token, false)
        .catch((err) => {
            //err: admin.FirebaseError
            const tmpError = new VError(err, 'CT VerifyIdToken() - Caught Unknown Error.');
            tmpError.name = DefaultErrors.AUTH_ERRORS.auth_failed;
            throw tmpError;
        });
}

/**
 * @description Verify decoded token contains property uid
 * @param {admin.auth.DecodedIdToken} decodedToken
 * @returns {admin.auth.DecodedIdToken} admin.auth.DecodedIdToken
 * @throws VError AUTH_ERRORS.auth_failed
 */
function VerifyDecodedTokenPropertyUID(decodedToken: admin.auth.DecodedIdToken): admin.auth.DecodedIdToken {
    assert.notStrictEqual(typeof decodedToken, 'undefined');
    assert.notStrictEqual(decodedToken, null);

    if (typeof decodedToken.uid !== 'undefined' && decodedToken.uid !== null) {
        return decodedToken;
    }
    else {
        const tmpError = new VError('CT VerifyDecodedTokenPropertyUID() - decodedToken.uid is either null or undefined.');
        tmpError.name = DefaultErrors.AUTH_ERRORS.auth_failed;
        throw tmpError;
    }
}

/**
 * @description Verifying request
 * @param {Request} req
 * @param {Request} res
 * @returns {Promise<void>} Promise<void>
 * @throws VError AUTH_ERRORS.auth_missing_headers
 * @throws VError AUTH_ERRORS.auth_missing_authorization
 * @throws VError AUTH_ERRORS.auth_authorization_is_array
 * @throws VError AUTH_ERRORS.auth_authorization_not_starting_with_bearer
 * @throws VError AUTH_ERRORS.auth_failed
 * @throws VError AUTH_ERRORS.auth_failed_user_not_found
 * @throws VError ERRORS.unknown
 */
export const VerifyAuthRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = await ValidateAuthHeaders(req);
        const decodedToken = await VerifyIdToken(token);

        const tmpDecodedToken = VerifyDecodedTokenPropertyUID(decodedToken);
        res.locals.decodedIdToken = tmpDecodedToken;

        const user = await UserDBMethods.RetrieveUserOnUid(tmpDecodedToken.uid);
        if (typeof user === 'undefined' || user === null) {
            // User doesnt exist
            const tmpError = new VError('CT VerifyAuthRequest() - User doesnt exist.');
            tmpError.name = DefaultErrors.AUTH_ERRORS.auth_failed_user_not_found;
            throw tmpError;
        }
    }
    catch (err) {
        let error = err;
        if ((error instanceof VError) === false) {
            error = new VError(err, 'CT VerifyAuthRequest() - Caught unknown error.');
            error.name = DefaultErrors.ERRORS.unknown;
        }
        logger.error(error);
        throw error;
    }

    return;
}

/**
 * @description Same as VerifyAuthRequest() but without checking if user exist in DB, because UserCreationSetup() inserts the user into DB.
 * @param {Request} req
 * @param {Request} res
 * @returns Promise<void>
 * @throws VError AUTH_ERRORS.auth_missing_headers
 * @throws VError AUTH_ERRORS.auth_missing_authorization
 * @throws VError AUTH_ERRORS.auth_authorization_is_array
 * @throws VError AUTH_ERRORS.auth_authorization_not_starting_with_bearer
 * @throws VError AUTH_ERRORS.auth_failed
 * @throws VError ERRORS.unknown
 */
export const VerifyAuthRequest_UserCreationSetup = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = await ValidateAuthHeaders(req);
        const decodedToken = await VerifyIdToken(token);
        const tmpDecodedToken = VerifyDecodedTokenPropertyUID(decodedToken);
        res.locals.decodedIdToken = tmpDecodedToken;
    }
    catch (err) {
        let error = err;
        if ((error instanceof VError) === false) {
            error = new VError(err, 'CT VerifyAuthRequest_UserCreationSetup() - Caught unknown error.');
            error.name = DefaultErrors.ERRORS.unknown;
        }
        logger.error(error);
        throw error;
    }

    return;
}
// #endregion


// #region User
/**
 * @description Set up user account
 * @param userId
 * @returns Promise<void>
 * @throws VError USER_ERRORS.profile_incomplete if email is missing
 * @throws VError ERRORS.unknown
 */
export const UserCreationSetup = async (userId: string, firstName: string, lastName: string): Promise<void> => {
    logger.debug('CT UserCreationSetup()');

    try {
        const userRecord = await admin.auth().getUser(userId);

        if (typeof userRecord.email === 'undefined' || userRecord.email === null) {
            const tmpError = new VError(`CT UserCreationSetup() - User record missing email property on user: ${userId}`);
            tmpError.name = DefaultErrors.USER_ERRORS.profile_incomplete;
            throw tmpError;
        }

        const tmpUser = new User(userRecord.uid, userRecord.email, firstName, lastName);

        await UserDBMethods.UserCreationSetup(tmpUser);
    } catch (err) {
        let error = err;
        if ((error instanceof VError) === false) {
            error = new VError(err, 'CT UserCreationSetup() - Caught unknown error.');
            error.name = DefaultErrors.ERRORS.unknown;
        }
        logger.error(error);
        throw error;
    }
}

/**
 * @description Retrieve user on uid
 * @param userId
 * @returns Promise<User>
 * @throws USER_ERRORS.user_not_found
 * @throws ERRORS.unknown
 */
export const RetrieveUserOnUid = async (userId: string): Promise<User> => {
    logger.debug('CT RetrieveUserOnUid()');

    try {
        const user = await UserDBMethods
            .RetrieveUserOnUid(userId);

        if (typeof user === 'undefined' || user === null) {
            // Doesnt exist
            const tempError = new VError('CT RetrieveUserOnUid() - User not found.');
            tempError.name = DefaultErrors.USER_ERRORS.user_not_found;
            throw tempError;
        }

        return user;
    }
    catch (err) {
        let error = err;
        if ((error instanceof VError) === false) {
            error = new VError(err, 'CT RetrieveUserOnUid() - Caught unknown error.');
            error.name = DefaultErrors.ERRORS.unknown;
        }
        logger.error(error);
        throw error;
    }
}
// #endregion