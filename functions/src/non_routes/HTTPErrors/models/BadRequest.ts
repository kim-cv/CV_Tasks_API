import { AbstractHTTPSError } from "./AbstractHTTPSError";

export class BadRequest extends AbstractHTTPSError {
    constructor(
        message?: string,
        code?: number
    ) {
        super(400, (code ? code : 400), (message ? message : 'Could not understand the request, please modify.'));
    }
}