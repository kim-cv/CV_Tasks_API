import { AbstractHTTPSError } from "./models/AbstractHTTPSError";
import { BadRequest } from "./models/BadRequest";
import { InternalServerError } from "./models/InternalServerError";


//Default Logic HTTP Errors range is 1000-1999

/**
 * missing_parameters 1000 400
 * @returns AbstractHTTPSError
 */
export const missing_parameters = (): AbstractHTTPSError => {
    return new BadRequest(`Missing Parameters`, 1000);
}

/**
 * missing_specific_parameter 1001 400
 * @returns AbstractHTTPSError
 */
export const missing_specific_parameter = (parameterName: string): AbstractHTTPSError => {
    return new BadRequest(`Missing parameter: ${parameterName}`, 1001);
}

/**
 * missing_req 1002 500
 * @returns AbstractHTTPSError
 */
export const missing_req = (): AbstractHTTPSError => {
    return new InternalServerError('Missing Request', 1002);
}

/**
 * missing_body 1003 500
 * @returns AbstractHTTPSError
 */
export const missing_body = (): AbstractHTTPSError => {
    return new InternalServerError(`Missing Body`, 1003);
}

/**
 * missing_specific_body_key 1004 400
 * @returns AbstractHTTPSError
 */
export const missing_specific_body_key = (keyName: string): AbstractHTTPSError => {
    return new BadRequest(`Missing body property: ${keyName}`, 1004);
}

/**
 * body_key_wrong_expected_type 1005 400
 * @returns AbstractHTTPSError
 */
export const body_key_wrong_expected_type = (keyName: string, datatype: string): AbstractHTTPSError => {
    return new BadRequest(`Expected: ${keyName} to be a ${datatype}`, 1005);
}

/**
 * body_key_invalid 1009 400
 * @returns AbstractHTTPSError
 */
export const body_key_invalid = (keyName: string, reason?: string): AbstractHTTPSError => {
    return new BadRequest(`Property: ${keyName} is invalid because: ${reason}`, 1009);
}

/**
 * missing_decodedIdToken 1006 500
 * @returns AbstractHTTPSError
 */
export const missing_decodedIdToken = (): AbstractHTTPSError => {
    return new InternalServerError(undefined, 1006);
}

/**
 * just_InternalServerError 1007 500
 * @returns AbstractHTTPSError
 */
export const just_InternalServerError = (): AbstractHTTPSError => {
    return new InternalServerError(undefined, 1007);
}

/**
 * data_not_json 1008 400
 * @returns AbstractHTTPSError
 */
export const data_not_json = (): AbstractHTTPSError => {
    return new BadRequest("Data is not json", 1008);
}

/**
 * missing_query 1009 400
 * @returns AbstractHTTPSError
 */
export const missing_query = (): AbstractHTTPSError => {
    return new BadRequest(`Missing query`, 1009);
}

/**
 * missing_query_parameter 1010 400
 * @returns AbstractHTTPSError
 */
export const missing_query_parameter = (parameterName: string): AbstractHTTPSError => {
    return new BadRequest(`Missing query parameter: ${parameterName}`, 1010);
}