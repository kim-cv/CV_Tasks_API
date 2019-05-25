// Firebase
import * as admin from 'firebase-admin';

// ExpressJS
import * as express from "express";

// Controllers
import * as task_controller from './controller';
import * as user_controller from '../user/controller';

// Utils
import * as DefaultUtils from '../non_routes/Utils/Utils';

// Error
import * as DefaultHTTPSErrors from '../non_routes/HTTPErrors/DefaultHTTPSErrors';
import { AbstractHTTPSError } from '../non_routes/HTTPErrors/models/AbstractHTTPSError';

// Export routes
export const task_router = express.Router();


/**
 * @api {get} /tasks list
 * @apiName GetTasks
 * @apiDescription Returns ARRAY of Tasks
 * @apiGroup tasks
 *
 * @apiUse taskObject
 *
 * @apiUse ApiAuthErrors
 * @apiError just_InternalServerError 1007
 *
 * @apiUse httpExampleError
*/
task_router.get('/',
    (req, res, next) => {
        user_controller.VerifyAuthRequest(req, res)
            .then(() => next())
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    },
    (req, res, next) => {
        const decodedToken: admin.auth.DecodedIdToken = res.locals.decodedIdToken;

        return task_controller.ListAllTasksByUser(decodedToken.uid)
            .then((result) => DefaultUtils.MapValueToHTTP(200, result))
            .then(httpResponse => res.status(httpResponse.httpCode).json(httpResponse.message))
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    });

/**
 * @api {get} /tasks/:taskId retrieve
 * @apiName RetrieveTask
 * @apiGroup tasks
 *
 * @apiParam (Query) {String} taskId
 * 
 * @apiUse taskObject
 *
 * @apiUse ApiAuthErrors
 * @apiError missing_parameters 1000 400
 * @apiError missing_specific_parameter 1001 400
 * @apiError task_not_found 3002 404
 * @apiError task_not_yours 3001 401
 * @apiError just_InternalServerError 1007 500
 *
 * @apiUse httpExampleError
 */
task_router.get('/:taskId',
    (req, res, next) => {
        user_controller.VerifyAuthRequest(req, res)
            .then(() => next())
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    },
    (req, res, next) => {
        let err: AbstractHTTPSError | undefined = undefined;

        if (typeof req.params === 'undefined' || req.params === null) { err = DefaultHTTPSErrors.missing_parameters(); }
        if (typeof req.params.taskId === 'undefined' || req.params.taskId === null) { err = DefaultHTTPSErrors.missing_specific_parameter('taskId'); }

        if (typeof err !== 'undefined' && err !== null) {
            res.status(err.httpCode).json(err)
        } else {
            next();
        }
    },
    (req, res, next) => {
        const decodedToken: admin.auth.DecodedIdToken = res.locals.decodedIdToken;
        const taskId = req.params.taskId;

        return task_controller.RetrieveTask(decodedToken.uid, taskId)
            .then((result) => DefaultUtils.MapValueToHTTP(200, result))
            .then(httpResponse => res.status(httpResponse.httpCode).json(httpResponse.message))
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    });

/**
 * @api {post} /tasks create
 * @apiName CreateTask
 * @apiGroup tasks
 * 
 * @apiParam (Request body) {String} name
 * @apiParam (Request body) {String} description
 * 
 * @apiUse taskCreationObject
 *
 * @apiUse ApiAuthErrors
 * @apiError missing_body 1003 500
 * @apiError missing_specific_body_key 1004 400
 * @apiError body_key_wrong_expected_type 1005 400
 * @apiError task_schema_invalid 3004 400
 * @apiError just_InternalServerError 1007 500
 *
 * @apiUse httpExampleError
 */
task_router.post('/',
    (req, res, next) => {
        user_controller.VerifyAuthRequest(req, res)
            .then(() => next())
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    },
    (req, res, next) => {
        let err: AbstractHTTPSError | undefined = undefined;

        if (typeof req.body === 'undefined' || req.body === null) { err = DefaultHTTPSErrors.missing_body(); }

        if (typeof req.body.name === 'undefined' || req.body.name === null) { err = DefaultHTTPSErrors.missing_specific_body_key('name'); }
        if (typeof req.body.name !== 'string') { err = DefaultHTTPSErrors.body_key_wrong_expected_type('name', 'string'); }

        if (typeof req.body.description === 'undefined' || req.body.description === null) { err = DefaultHTTPSErrors.missing_specific_body_key('description'); }
        if (typeof req.body.description !== 'string') { err = DefaultHTTPSErrors.body_key_wrong_expected_type('description', 'string'); }

        if (typeof err !== 'undefined' && err !== null) {
            res.status(err.httpCode).json(err)
        } else {
            next();
        }
    },
    (req, res, next) => {
        const decodedToken: admin.auth.DecodedIdToken = res.locals.decodedIdToken;
        const taskName = req.body.name;
        const taskDescription = req.body.description;

        return task_controller.CreateTask(decodedToken.uid, taskName, taskDescription)
            .then((result) => DefaultUtils.MapValueToHTTP(201, result))
            .then(httpResponse => res.status(httpResponse.httpCode).json(httpResponse.message))
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    });

/**
 * @api {put} /tasks/:taskId update
 * @apiName UpdateTask
 * @apiGroup tasks
 *
 * @apiParam (Query) {String} taskId
 * 
 * @apiParam (Request body) {String} name
 * @apiParam (Request body) {String} description
 * 
 * @apiuse taskObject
 *
 * @apiUse ApiAuthErrors
 * @apiError missing_body 1003 500
 * @apiError missing_specific_body_key 1004 400
 * @apiError body_key_wrong_expected_type 1005 400
 * @apiError missing_parameters 1000 400
 * @apiError missing_specific_parameter 1001 400
 * @apiError task_not_found 3002 404
 * @apiError task_not_yours 3001 401
 * @apiError task_schema_invalid 3004 400
 * @apiError just_InternalServerError 1007 500
 *
 * @apiUse httpExampleError
 */
task_router.put('/:taskId',
    (req, res, next) => {
        user_controller.VerifyAuthRequest(req, res)
            .then(() => next())
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    },
    (req, res, next) => {
        let err: AbstractHTTPSError | undefined = undefined;

        if (typeof req.params === 'undefined' || req.params === null) { err = DefaultHTTPSErrors.missing_parameters(); }
        if (typeof req.params.taskId === 'undefined' || req.params.taskId === null) { err = DefaultHTTPSErrors.missing_specific_parameter('taskId'); }

        if (typeof req.body === 'undefined' || req.body === null) { err = DefaultHTTPSErrors.missing_body(); }

        if (typeof req.body.name === 'undefined' || req.body.name === null) { err = DefaultHTTPSErrors.missing_specific_body_key('name'); }
        if (typeof req.body.name !== 'string') { err = DefaultHTTPSErrors.body_key_wrong_expected_type('name', 'string'); }

        if (typeof req.body.description === 'undefined' || req.body.description === null) { err = DefaultHTTPSErrors.missing_specific_body_key('description'); }
        if (typeof req.body.description !== 'string') { err = DefaultHTTPSErrors.body_key_wrong_expected_type('description', 'string'); }

        if (typeof err !== 'undefined' && err !== null) {
            res.status(err.httpCode).json(err)
        } else {
            next();
        }
    },
    (req, res, next) => {
        const decodedToken: admin.auth.DecodedIdToken = res.locals.decodedIdToken;
        const taskId = req.params.taskId;
        const taskName = req.body.name;
        const taskDescription = req.body.description;

        return task_controller.UpdateTask(decodedToken.uid, taskId, taskName, taskDescription)
            .then((result) => DefaultUtils.MapValueToHTTP(200, result))
            .then(httpResponse => res.status(httpResponse.httpCode).json(httpResponse.message))
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    });

/**
 * @api {delete} /tasks/:taskId delete
 * @apiName DeleteTask
 * @apiGroup tasks
 *
 * @apiParam (Query) {String} taskId
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 *
 * @apiUse ApiAuthErrors
 * @apiError missing_parameters 1000 400
 * @apiError missing_specific_parameter 1001 400
 * @apiError task_not_found 3002 404
 * @apiError task_not_yours 3001 401
 * @apiError just_InternalServerError 1007 500
 *
 * @apiUse httpExampleError
 */
task_router.delete('/:taskId',
    (req, res, next) => {
        user_controller.VerifyAuthRequest(req, res)
            .then(() => next())
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    },
    (req, res, next) => {
        let err: AbstractHTTPSError | undefined = undefined;

        if (typeof req.params === 'undefined' || req.params === null) { err = DefaultHTTPSErrors.missing_parameters(); }
        if (typeof req.params.taskId === 'undefined' || req.params.taskId === null) { err = DefaultHTTPSErrors.missing_specific_parameter('taskId'); }

        if (typeof err !== 'undefined' && err !== null) {
            res.status(err.httpCode).json(err)
        } else {
            next();
        }
    },
    (req, res, next) => {
        const decodedToken: admin.auth.DecodedIdToken = res.locals.decodedIdToken;
        const taskId = req.params.taskId;

        return task_controller.DeleteTask(decodedToken.uid, taskId)
            .then(() => DefaultUtils.MapValueToHTTP(204))
            .then(httpResponse => res.status(httpResponse.httpCode).json(httpResponse.message))
            .catch(err => { const httpError = DefaultUtils.MapToHTTPError(err); res.status(httpError.httpCode).json(httpError) })
    });
