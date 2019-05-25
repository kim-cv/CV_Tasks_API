import { AbstractHTTPResponse } from "../AbstractHTTPResponse";

export abstract class AbstractHTTPSError extends AbstractHTTPResponse {
    public code: number;

    constructor(_httpCode: number, _code: number, _message: string) {
        super(_httpCode);
        this.code = _code;
        this.AddObject(_message);
    }

    toJSON() {
        return {
            httpCode: this.httpCode,
            code: this.code,
            message: this.message
        }
    }    
}