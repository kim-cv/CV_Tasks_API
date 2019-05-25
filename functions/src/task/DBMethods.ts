// Firebase
import * as admin from 'firebase-admin';
const db_firestore = admin.firestore();
const ref_tasks = db_firestore.collection('tasks');

// Models
import { Task } from './models/Task';

// Errors
import { VError } from 'verror';
import * as logger from '../non_routes/Utils/logger';
import { ERRORS } from '../non_routes/Utils/Errors_ENUM';

// Utils
import * as moment from 'moment';
import assert = require('assert');


/**
 * @description Retrieve task on id
 * @param {string} taskId
 * @returns {Promise<Task | null>} Promise<Task | null>
 * @throws {VError} DefaultErrors.ERRORS.unknown
*/
export const RetrieveTask = async (taskId: string): Promise<Task | null> => {
    logger.debug(`DB RetrieveTask()`);

    assert.notStrictEqual(taskId, null);
    assert.strictEqual(typeof taskId, 'string');

    try {
        const docSnapshot = await ref_tasks
            .doc(taskId)
            .get();

        if (docSnapshot.exists === false) {
            return null;
        }

        const data = docSnapshot.data();
        if (typeof data === 'undefined' || data === null) {
            return null;
        }

        const tmpObject = data;
        tmpObject.uid = docSnapshot.id;

        return Task.ConstructFromData(tmpObject);
    }
    catch (err) {
        const newError = new VError(err, 'DB RetrieveTask() - Caught Unknown Error.');
        newError.name = ERRORS.unknown;
        logger.error(newError);
        throw newError;
    }
}

/**
 * @description List all tasks from user
 * @param {string} userUid
 * @returns {Promise<Task[]>} Promise<Task[]>
 * @throws {VError} DefaultErrors.ERRORS.unknown
 */
export const ListAllTasksByUser = async (userUid: string): Promise<Task[]> => {
    logger.debug(`DB ListAllTasksByUser()`);

    assert.notStrictEqual(userUid, null);
    assert.strictEqual(typeof userUid, 'string');

    try {
        // Order newest tasks first
        const querySnapshot = await ref_tasks
            .orderBy('creationDateUtcIso', 'desc')
            .where('ownerUid', '==', userUid)
            .get();

        const tasks: Task[] = [];
        querySnapshot.forEach(docSnapshot => {
            const tmpObject = docSnapshot.data();
            tmpObject.uid = docSnapshot.id;

            const tmpTask = Task.ConstructFromData(tmpObject);

            if (typeof tmpTask !== 'undefined' && tmpTask !== null) {
                tasks.push(tmpTask);
            }
            else {
                const tmpError = new VError(`DB ListAllTasksByUser() - ConstructFromData() returned either undefined or null from Task: ${docSnapshot.id}`);
                logger.error(tmpError);
            }
        });

        return tasks;
    }
    catch (err) {
        const newError = new VError(err, 'DB ListAllTasksByUser() - Caught Unknown Error.');
        newError.name = ERRORS.unknown;
        logger.error(newError);
        throw newError;
    }
}

/**
 * @description Create task
 * @param {string} ownerUID UID of user who owns this task
 * @param {string} name
 * @param {string} description
 * @returns {Promise<Task>} Promise<Task>
 * @throws {VError} DefaultErrors.ERRORS.unknown
 */
export const CreateTask = async (ownerUID: string, name: string, description: string): Promise<Task> => {
    logger.debug(`DB CreateTask()`);

    assert.notStrictEqual(ownerUID, null);
    assert.strictEqual(typeof ownerUID, 'string');
    assert.strictEqual(typeof name, 'string');
    assert.notStrictEqual(name, null);
    assert.strictEqual(typeof description, 'string');
    assert.notStrictEqual(description, null);    

    const tmpTask = new Task(
        ref_tasks.doc().id,
        ownerUID,
        name,
        description,
        moment().utc().toISOString()
    )

    try {
        await ref_tasks
            .doc(tmpTask.uid)
            .set(tmpTask.ToDB());

        return tmpTask;
    }
    catch (err) {
        const newError = new VError(err, 'DB CreateTask() - Caught Unknown Error.');
        newError.name = ERRORS.unknown;
        logger.error(newError);
        throw newError;
    }
}

/**
 * @description Update task
 * @param {Task} task
 * @returns {Promise<void>} Promise<void>
 * @throws {VError} DefaultErrors.ERRORS.unknown
 */
export const UpdateTask = async (task: Task): Promise<void> => {
    logger.debug(`DB UpdateTask()`);

    assert.notStrictEqual(task, null);
    assert.notStrictEqual(typeof task, 'undefined');

    try {
        await ref_tasks
            .doc(task.uid)
            .update(task.ToDB());
        return;
    } catch (err) {
        const newError = new VError(err, 'DB UpdateTask() - Caught Unknown Error.');
        newError.name = ERRORS.unknown;
        logger.error(newError);
        throw newError;
    }
}

/**
 * @description Delete task
 * @param {string} taskId
 * @returns {Promise<void>} Promise<void>
 * @throws {VError} DefaultErrors.ERRORS.unknown
 */
export const DeleteTask = async (taskId: string): Promise<void> => {
    logger.debug(`DB DeleteTask()`);

    assert.notStrictEqual(taskId, null);
    assert.strictEqual(typeof taskId, 'string');

    try {
        await ref_tasks
            .doc(taskId)
            .delete();
        return;
    } catch (err) {
        const newError = new VError(err, 'DB DeleteTask() - Caught Unknown Error.');
        newError.name = ERRORS.unknown;
        logger.error(newError);
        throw newError;
    }
}