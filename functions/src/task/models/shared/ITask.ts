export interface ITask {
    uid: string;
    ownerUid: string;
    name: string;
    description: string;
    /**
     * @description ISO 8601 formatted in UTC
     */
    creationDateUtcIso: string | undefined;
}


/** 
 * @apiDefine taskObject
 * @apiSuccess {String} uid
 * @apiSuccess {String} ownerUid
 * @apiSuccess {String} name
 * @apiSuccess {String} description
 * @apiSuccess {String} creationDateUtcIso
*/
/** 
 * @apiDefine taskCreationObject
 * @apiSuccess (201) {String} uid
 * @apiSuccess (201) {String} ownerUid
 * @apiSuccess (201) {String} name
 * @apiSuccess (201) {String} description
 * @apiSuccess (201) {String} creationDateUtcIso
*/