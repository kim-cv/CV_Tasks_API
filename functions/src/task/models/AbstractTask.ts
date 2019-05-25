import { ITask } from "./shared/ITask";
import * as Joi from '@hapi/joi'

export abstract class AbstractTask implements ITask {
    public uid: string;
    public static uid_validation_rules = Joi.string().strict().trim().alphanum().required();

    public ownerUid: string;
    public static ownerUid_validation_rules = Joi.string().strict().trim().min(1).alphanum().required();

    public name: string;
    public static name_validation_rules = Joi.string().strict().trim().min(1).regex(/^[ a-zA-Z0-9æøåÆØÅ\n.,]+$/i).max(30).required();

    public description: string;
    public static description_validation_rules = Joi.string().strict().trim().min(1).regex(/^[ a-zA-Z0-9æøåÆØÅ\n.,]+$/i).max(250).required();

    public creationDateUtcIso: string | undefined;
    public static creationDateUtcIso_validation_rules = Joi.string().strict().isoDate().allow(null).optional();

    constructor(
        _uid: string,
        _ownerUid: string,
        _name: string,
        _description: string,
        _creationDateUtcIso?: string
    ) {
        this.uid = _uid;
        this.ownerUid = _ownerUid;
        this.name = _name;
        this.description = _description;
        this.creationDateUtcIso = (typeof _creationDateUtcIso !== 'undefined' && _creationDateUtcIso !== null) ? _creationDateUtcIso : undefined;
    }
}