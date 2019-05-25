import { AbstractHTTPSError } from "../non_routes/HTTPErrors/models/AbstractHTTPSError";
import { Unauthorized } from "../non_routes/HTTPErrors/models/Unauthorized";
import { Conflict } from "../non_routes/HTTPErrors/models/Conflict";
import { NotFound } from "../non_routes/HTTPErrors/models/NotFound";

//User HTTP Errors range is 2000-2999

/**
* auth_failed 2001 401
* @returns AbstractHTTPSError
*/
export const auth_failed = (): AbstractHTTPSError => {
    return new Unauthorized('Auth Failed', 2001);
}

/**
* auth_missing_req 2002 401
* @returns AbstractHTTPSError
*/
export const auth_missing_req = (): AbstractHTTPSError => {
    return new Unauthorized('Missing request', 2002);
}

/**
* auth_missing_headers 2003 401
* @returns AbstractHTTPSError
*/
export const auth_missing_headers = (): AbstractHTTPSError => {
    return new Unauthorized('Missing headers', 2003);
}

/**
* auth_missing_authorization 2004 401
* @returns AbstractHTTPSError
*/
export const auth_missing_authorization = (): AbstractHTTPSError => {
    return new Unauthorized('Missing header authorization', 2004);
}

/**
* auth_authorization_is_array 2005 401
* @returns AbstractHTTPSError
*/
export const auth_authorization_is_array = (): AbstractHTTPSError => {
    return new Unauthorized('Header authorization is a array', 2005);
}

/**
* auth_authorization_not_starting_with_bearer 2006 401
* @returns AbstractHTTPSError
*/
export const auth_authorization_not_starting_with_bearer = (): AbstractHTTPSError => {
    return new Unauthorized('Header authorization is not starting with bearer', 2006);
}

/**
* profile_incomplete 2007 409
* @returns AbstractHTTPSError
*/
export const profile_incomplete = (): AbstractHTTPSError => {
    return new Conflict(undefined, 2007);
}

/**
* user_not_found 2009 404
* @returns AbstractHTTPSError
*/
export const user_not_found = (): AbstractHTTPSError => {
    return new NotFound('User not found', 2009);
}

/**
* auth_failed_user_not_found 2010 401
* @returns AbstractHTTPSError
*/
export const auth_failed_user_not_found = (): AbstractHTTPSError => {
    return new Unauthorized('Auth failed User not found', 2010);
}