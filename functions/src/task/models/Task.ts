import { AbstractTask } from './AbstractTask';
import * as Joi from '@hapi/joi'

export class Task extends AbstractTask {
    constructor(
        _uid: string,
        _ownerUid: string,
        _name: string,
        _description: string,
        _creationDateUtcIso?: string
    ) {
        super(_uid, _ownerUid, _name, _description, _creationDateUtcIso);
    }

    public static ConstructFromData(data: any, validateUid: boolean = true): Task | null {
        if (!this.ValidateObject(data, validateUid).error) {
            return new Task(
                data.uid,
                data.ownerUid,
                data.name,
                data.description,
                data.creationDateUtcIso
            );
        } else {
            return null;
        }
    }

    public static ValidateObject(data: {}, validateUid: boolean = true): Joi.ValidationResult<any> {
        let schema = Joi.object().keys({
            name: AbstractTask.name_validation_rules,
            ownerUid: AbstractTask.ownerUid_validation_rules,
            description: AbstractTask.description_validation_rules,
            creationDateUtcIso: AbstractTask.creationDateUtcIso_validation_rules
        });

        if (validateUid === true) {
            schema = schema.keys({
                uid: AbstractTask.uid_validation_rules
            });
        } else {
            schema = schema.keys({
                uid: Joi.string().strict().trim().alphanum().optional()
            });
        }

        return Joi.validate(data, schema, { abortEarly: false });
    }

    public ToDB(): {} {
        return {
            ownerUid: this.ownerUid,
            name: this.name,
            description: this.description,
            creationDateUtcIso: (typeof this.creationDateUtcIso !== 'undefined' && this.creationDateUtcIso !== null) ? this.creationDateUtcIso : null
        };
    }

    public toJSON(): { [index: string]: any } {
        return {
            uid: this.uid,
            ownerUid: this.ownerUid,
            name: this.name,
            description: this.description,
            creationDateUtcIso: (typeof this.creationDateUtcIso !== 'undefined' && this.creationDateUtcIso !== null) ? this.creationDateUtcIso : null
        };
    }
}