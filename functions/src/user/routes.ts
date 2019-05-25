// Firebase
import * as admin from 'firebase-admin';

// Express
import * as express from "express";

// Controllers
import * as user_controller from '../user/controller';

// Utils
import * as DefaultUtils from '../non_routes/Utils/Utils';

// Error
import * as DefaultHTTPSErrors from '../non_routes/HTTPErrors/DefaultHTTPSErrors';
import { AbstractHTTPSError } from '../non_routes/HTTPErrors/models/AbstractHTTPSError';

// Export routes
export const user_router = express.Router();



/**
 * @api {post} /users/:uid Setup User account
 * @apiName UserSetupAccount
 * @apiGroup users
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 * 
 * @apiParam (Request body) {String} firstName
 * @apiParam (Request body) {String} lastName
 *
 * @apiUse ApiAuthErrors
 * @apiError missing_body 1003 500
 * @apiError missing_specific_body_key 1004 400
 * @apiError body_key_wrong_expected_type 1005 400
 * @apiError profile_incomplete 2007 409 if email is missing
 * @apiError just_InternalServerError 1007 500
 *
 * @apiUse httpExampleError
 */
user_router.post('/',
    (req, res, next) => {
        user_controller.VerifyAuthRequest_UserCreationSetup(req, res)
            .then(() => next())
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    },
    (req, res, next) => {
        let err: AbstractHTTPSError | undefined = undefined;

        if (!req.body) { err = DefaultHTTPSErrors.missing_body(); }

        if (!req.body.firstName) { err = DefaultHTTPSErrors.missing_specific_body_key('firstName'); }
        if (typeof req.body.firstName !== 'string') { err = DefaultHTTPSErrors.body_key_wrong_expected_type('firstName', 'string'); }

        if (!req.body.lastName) { err = DefaultHTTPSErrors.missing_specific_body_key('lastName'); }
        if (typeof req.body.lastName !== 'string') { err = DefaultHTTPSErrors.body_key_wrong_expected_type('lastName', 'string'); }

        if (typeof err !== 'undefined' && err !== null) {
            res.status(err.httpCode).json(err)
        } else {
            next();
        }
    },
    (req, res, next) => {
        const decodedToken: admin.auth.DecodedIdToken = res.locals.decodedIdToken;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        return user_controller.UserCreationSetup(decodedToken.uid, firstName, lastName)
            .then(() => DefaultUtils.MapValueToHTTP(204))
            .then(httpResponse => res.status(httpResponse.httpCode).json(httpResponse.message))
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) });
    });

/**
 * @api {get} /users retrieve
 * @apiName GetUser
 * @apiGroup users
 *
 * @apiUse userObject
 *
 * @apiUse ApiAuthErrors
 * @apiError user_not_found 2009 404
 * @apiError just_InternalServerError 1007 500
 *
 * @apiUse httpExampleError
 */
user_router.get('/',
    (req, res, next) => {
        user_controller.VerifyAuthRequest(req, res)
            .then(() => next())
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    },
    (req, res, next) => {
        const decodedToken: admin.auth.DecodedIdToken = res.locals.decodedIdToken;
        
        return user_controller.RetrieveUserOnUid(decodedToken.uid)
            .then((result) => DefaultUtils.MapValueToHTTP(200, result))
            .then(httpResponse => res.status(httpResponse.httpCode).json(httpResponse.message))
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) });
    });