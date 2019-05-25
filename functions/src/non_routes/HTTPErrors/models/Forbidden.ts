import { AbstractHTTPSError } from "./AbstractHTTPSError";

export class Forbidden extends AbstractHTTPSError {
    constructor(
        message?: string,
        code?: number
    ) {
        super(403, (code ? code : 403), (message ? message : 'Forbidden'));
    }
}