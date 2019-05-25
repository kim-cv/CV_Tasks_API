export interface IUser {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
}

/** 
 * @apiDefine userObject
 * @apiSuccess {String} uid
 * @apiSuccess {String} email
 * @apiSuccess {String} firstName
 * @apiSuccess {String} lastName
*/