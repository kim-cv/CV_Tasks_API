import { AbstractHTTPResponse } from "./AbstractHTTPResponse";

export class HTTPSuccess extends AbstractHTTPResponse {
    constructor(
        _httpCode: number
    ) {
        super(_httpCode);
    }
}