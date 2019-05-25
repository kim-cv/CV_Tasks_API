import { AbstractHTTPSError } from "./AbstractHTTPSError";

export class InternalServerError extends AbstractHTTPSError {
    constructor(
        message?: string,
        code?: number
    ) {
        super(500, (code ? code : 500), (message ? message : 'Something broke, errors has been logged and will be investigated.'));
    }
}