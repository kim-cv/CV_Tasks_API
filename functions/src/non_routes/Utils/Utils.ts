import * as DefaultHTTPSErrors from '../HTTPErrors/DefaultHTTPSErrors';
import * as Errors_ENUM from './Errors_ENUM';
import * as TaskHTTPSErrors from '../../task/HTTPSErrors';
import * as UserHTTPSErrors from '../../user/HTTPSErrors';

// Models
import { AbstractHTTPSError } from "../HTTPErrors/models/AbstractHTTPSError";
import { HTTPSuccess } from "../HTTPErrors/HTTPSuccess";

// Util
import * as VError from "verror";


export const MapValueToHTTP = (statusCode: number, value?: any): HTTPSuccess => {
    const tmpSuccess = new HTTPSuccess(statusCode);

    if (typeof value !== 'undefined' && value !== null) {
        tmpSuccess.AddObject(value);
    }

    return tmpSuccess;
}

export const MapToHTTPError = (err?: any, extra?: any): AbstractHTTPSError => {
    if (typeof err === 'undefined' || err === null) {
        return DefaultHTTPSErrors.just_InternalServerError()
    }
    if ((err instanceof VError) === false) {
        return DefaultHTTPSErrors.just_InternalServerError()
    }

    switch (err.name) {
        //TASK_ERRORS
        case Errors_ENUM.TASK_ERRORS.could_not_find_task_on_id:
            return TaskHTTPSErrors.task_not_found();
        case Errors_ENUM.TASK_ERRORS.task_not_yours:
            return TaskHTTPSErrors.task_not_yours();
        case Errors_ENUM.TASK_ERRORS.schema_invalid:
            return TaskHTTPSErrors.task_schema_invalid();

        //USER_ERRORS
        case Errors_ENUM.USER_ERRORS.user_not_found:
            return UserHTTPSErrors.user_not_found();
        case Errors_ENUM.USER_ERRORS.profile_incomplete:
            return UserHTTPSErrors.profile_incomplete();

        //ERRORS
        case Errors_ENUM.ERRORS.unknown:
            return DefaultHTTPSErrors.just_InternalServerError();
        case Errors_ENUM.ERRORS.wrong_type:
            return DefaultHTTPSErrors.just_InternalServerError();

        //No error was found
        default:
            return DefaultHTTPSErrors.just_InternalServerError();
    }
}

export const TryParseJSON = (jsonString: string): object | undefined => {
    try {
        const tmp = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (tmp && typeof tmp === "object" && tmp !== null) {
            return tmp;
        }
    }
    catch (e) { }

    return undefined;
};
export const IsJson = (item: any): boolean => {
    const tempItem = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    if (typeof TryParseJSON(tempItem) !== 'undefined') {
        return true;
    } else {
        return false;
    }
}

/**
 * @description Returns a VError with a supplied message and name
 * @param message 
 * @param name 
 */
export const doThrow = (message: string, name: any): VError => {
    const tmpError = new VError(message);
    tmpError.name = name;
    return tmpError;
}

/**
 * @description Wraps Error inside a new VError and returns it, if error is already VError it just returns it.
 * @param error 
 * @param message 
 * @param name 
 */
export const reThrow = (error: Error | VError, message: string, name: any): VError => {
    let tmpError: VError;

    if ((error instanceof VError) === false) {
        tmpError = new VError(error, message);
        tmpError.name = name;
    } else {
        tmpError = <VError>error;
    }

    return tmpError;
}