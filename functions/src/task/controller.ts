// DB
import * as TaskDBMethods from './DBMethods';

// Models
import { Task } from './models/Task';

// Error
import { VError } from 'verror';
import * as logger from '../non_routes/Utils/logger';
import * as DefaultErrors from '../non_routes/Utils/Errors_ENUM';


/**
 * @description Is user owning this task
 * @param {string} userUid
 * @param {Task} task
 * @returns {boolean} boolean
 */
export const IsUserOwnerOfTask = (userUid: string, task: Task): boolean => {
    logger.debug(`CT IsUserOwnerOfTask()`);
    return (task.ownerUid === userUid);
}

/**
 * @description List all tasks from user
 * @param userId
 * @return Promise<Task[]>
 * @throws ERRORS.unknown
 */
export const ListAllTasksByUser = async (userId: string): Promise<Task[]> => {
    logger.debug('CT ListAllTasksByUser()');

    try {
        return TaskDBMethods.ListAllTasksByUser(userId);
    }
    catch (err) {
        let error = err;
        if ((error instanceof VError) === false) {
            error = new VError(err, 'CT ListAllTasksByUser() - Caught unknown error.');
            error.name = DefaultErrors.ERRORS.unknown;
        }
        logger.error(error);
        throw error;
    }
}

/**
 * @description Retrieve a task from user
 * @param userId 
 * @param taskId 
 * @returns Promise<Task>
 * @throws {VError} ERRORS.unknown
 * @throws {VError} TASK_ERRORS.could_not_find_task_on_id
 * @throws {VError} TASK_ERRORS.task_not_yours
 */
export const RetrieveTask = async (userId: string, taskId: string): Promise<Task> => {
    logger.debug('CT RetrieveTask()');

    // Try get task
    let task: Task | null;
    try {
        task = await TaskDBMethods.RetrieveTask(taskId);
    } catch (err) {
        const tmpError = new VError(err, `CT RetrieveTask() - RetrieveTask() returned err.`);
        tmpError.name = DefaultErrors.ERRORS.unknown;
        logger.error(tmpError);
        throw tmpError;
    }
    
    if (typeof task === 'undefined' || task === null) {
        const tmpError = new VError(`CT RetrieveTask() - RetrieveTask() returned either undefined or null.`);
        tmpError.name = DefaultErrors.TASK_ERRORS.could_not_find_task_on_id;
        logger.error(tmpError);
        throw tmpError;
    }

    // Check ownership
    if (IsUserOwnerOfTask(userId, task) === false) {
        const tmpError = new VError(`CT RetrieveTask() - IsUserOwnerOfTask() not yours.`);
        tmpError.name = DefaultErrors.TASK_ERRORS.task_not_yours;
        throw tmpError;
    }

    return task;
}

/**
 * @description Create task
 * @param userId 
 * @param name 
 * @returns Promise<Task>
 * @throws {VError} VError DefaultErrors.TASK_ERRORS.schema_invalid
 * @throws {VError} ERRORS.unknown
 */
export const CreateTask = async (userId: string, name: string, description: string): Promise<Task> => {
    logger.debug('CT CreateTask()');

    const object = {
        ownerUid: userId,
        name: name,
        description: description,
        creationDateUtcIso: undefined
    }

    // Validate Schema
    const validationResult = Task.ValidateObject(object, false);
    if (validationResult.error !== null) {
        const tmpError = new VError(validationResult.error, 'CT CreateTask() - Schema Invalid.');
        tmpError.name = DefaultErrors.TASK_ERRORS.schema_invalid;
        throw tmpError;
    }

    try {
        return TaskDBMethods
            .CreateTask(userId, name, description);
    }
    catch (err) {
        let error = err;
        if ((error instanceof VError) === false) {
            error = new VError(err, 'CT CreateTask() - Caught unknown error.');
            error.name = DefaultErrors.ERRORS.unknown;
        }
        logger.error(error);
        throw error;
    }
}

/**
 * @description Update task
 * @param userId 
 * @param taskId 
 * @param name 
 * @param description 
 * @returns Promise<Task>
 * @throws {VError} ERRORS.unknown
 * @throws {VError} TASK_ERRORS.could_not_find_task_on_id
 * @throws {VError} TASK_ERRORS.task_not_yours
 * @throws {VError} TASK_ERRORS.schema_invalid
 */
export const UpdateTask = async (userId: string, taskId: string, name: string, description: string): Promise<Task> => {
    logger.debug('CT UpdateTask()');

    // Try get task
    let task: Task | null;
    try {
        task = await TaskDBMethods.RetrieveTask(taskId);
    } catch (err) {
        const tmpError = new VError(err, `CT UpdateTask() - RetrieveTask() returned err.`);
        tmpError.name = DefaultErrors.ERRORS.unknown;
        logger.error(tmpError);
        throw tmpError;
    }
    if (typeof task === 'undefined' || task === null) {
        const tmpError = new VError(`CT UpdateTask() - RetrieveTask() returned either undefined or null.`);
        tmpError.name = DefaultErrors.TASK_ERRORS.could_not_find_task_on_id;
        logger.error(tmpError);
        throw tmpError;
    }

    // Check ownership
    if (IsUserOwnerOfTask(userId, task) === false) {
        const tmpError = new VError(`CT UpdateTask() - IsUserOwnerOfTask() not yours.`);
        tmpError.name = DefaultErrors.TASK_ERRORS.task_not_yours;
        logger.error(tmpError);
        throw tmpError;
    }

    // Update properties
    task.name = name;
    task.description = description;

    // Validate Schema
    const validationResult = Task.ValidateObject(task.toJSON(), false);
    if (validationResult.error !== null) {
        const tmpError = new VError(validationResult.error, 'CT UpdateTask() - Schema Invalid.');
        tmpError.name = DefaultErrors.TASK_ERRORS.schema_invalid;
        logger.error(tmpError);
        throw tmpError;
    }

    // Try update
    try {
        await TaskDBMethods.UpdateTask(task);
    } catch (err) {
        const tmpError = new VError(err, `CT UpdateTask() - task not updated.`);
        tmpError.name = DefaultErrors.ERRORS.unknown;
        logger.error(tmpError);
        throw tmpError;
    }

    return task;
}

/**
 * @description Delete task
 * @param userId 
 * @param taskId 
 * @returns Promise<void>
 * @throws {VError} ERRORS.unknown
 * @throws {VError} TASK_ERRORS.could_not_find_task_on_id
 * @throws {VError} TASK_ERRORS.task_not_yours
 */
export const DeleteTask = async (userId: string, taskId: string): Promise<void> => {
    logger.debug('CT DeleteTask()');

    // Try get task
    let task: Task | null;
    try {
        task = await TaskDBMethods.RetrieveTask(taskId);
    } catch (err) {
        const tmpError = new VError(err, `CT DeleteTask() - RetrieveTask() returned err.`);
        tmpError.name = DefaultErrors.ERRORS.unknown;
        logger.error(tmpError);
        throw tmpError;
    }
    if (typeof task === 'undefined' || task === null) {
        const tmpError = new VError(`CT DeleteTask() - RetrieveTask() returned either undefined or null.`);
        tmpError.name = DefaultErrors.TASK_ERRORS.could_not_find_task_on_id;
        logger.error(tmpError);
        throw tmpError;
    }

    // Check ownership
    if (IsUserOwnerOfTask(userId, task) === false) {
        const tmpError = new VError(`CT DeleteTask() - IsUserOwnerOfTask() not yours.`);
        tmpError.name = DefaultErrors.TASK_ERRORS.task_not_yours;
        throw tmpError;
    }

    // Try delete task
    try {
        await TaskDBMethods.DeleteTask(task.uid);
    } catch (err) {
        const tmpError = new VError(err, `CT DeleteTask() - Err at DeleteTask() - Could not delete task.`);
        tmpError.name = DefaultErrors.ERRORS.unknown;
        throw tmpError;
    }

    return;
}