import { AbstractHTTPSError } from "../non_routes/HTTPErrors/models/AbstractHTTPSError";
import { Unauthorized } from "../non_routes/HTTPErrors/models/Unauthorized";
import { NotFound } from "../non_routes/HTTPErrors/models/NotFound";
import { Conflict } from "../non_routes/HTTPErrors/models/Conflict";
import { BadRequest } from "../non_routes/HTTPErrors/models/BadRequest";

//Task HTTP Errors range is 3000-3999

/**
 * task_not_yours 3001 401
 * @returns AbstractHTTPSError
 */
export const task_not_yours = (): AbstractHTTPSError => {
    return new Unauthorized('Task is not yours', 3001);
}

/**
 * task_not_found 3002 404
 * @returns AbstractHTTPSError
 */
export const task_not_found = (): AbstractHTTPSError => {
    return new NotFound('Task not found', 3002);
}

/**
 * task_not_updated 3003 409
 * @returns AbstractHTTPSError
 */
export const task_not_updated = (): AbstractHTTPSError => {
    return new Conflict('Task not updated', 3003);
}

/**
 * task_schema_invalid 3004 400
 * @returns AbstractHTTPSError
 */
export const task_schema_invalid = (): AbstractHTTPSError => {
    return new BadRequest('Schema invalid', 3004);
}