import { AbstractHTTPSError } from "./AbstractHTTPSError";

export class Unauthorized extends AbstractHTTPSError {
    constructor(
        message?: string,
        code?: number
    ) {
        super(401, (code ? code : 401), (message ? message : 'You dont have access to this resource.'));
    }
}