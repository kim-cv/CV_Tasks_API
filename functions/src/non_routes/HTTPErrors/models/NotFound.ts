import { AbstractHTTPSError } from "./AbstractHTTPSError";

export class NotFound extends AbstractHTTPSError {
    constructor(
        message?: string,
        code?: number
    ) {
        super(404, (code ? code : 404), (message ? message : 'Resource could not be found.'));
    }
}