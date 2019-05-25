import { AbstractHTTPSError } from "./AbstractHTTPSError";

export class Conflict extends AbstractHTTPSError {
    constructor(
        message?: string,
        code?: number
    ) {
        super(409, (code ? code : 409), (message ? message : 'Resources conflicted.'));
    }
}