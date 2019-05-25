import * as Joi from '@hapi/joi'
import { IUser } from './shared/IUser';

export class User implements IUser {
    public uid: string;
    public email: string;
    public firstName: string;
    public lastName: string;


    constructor(
        _uid: string,
        _email: string,
        _firstname: string,
        _lastname: string
    ) {
        this.uid = _uid;
        this.email = _email;
        this.firstName = _firstname;
        this.lastName = _lastname;
    }

    public static ConstructFromData(data: any): User | null {
        if (!this.ValidateObject(data).error) {
            return new User(
                data.uid,
                data.email,
                data.firstName,
                data.lastName
            );
        } else {
            return null;
        }
    }

    public static ValidateObject(data: {}): Joi.ValidationResult<any> {
        const schema = Joi.object().keys({
            uid: Joi.string().strict().required(),
            email: Joi.string().strict().email().required(),
            firstName: Joi.string().strict().required(),
            lastName: Joi.string().strict().required()
        });

        return Joi.validate(data, schema);
    }

    ToDB(): IUser {
        return {
            uid: this.uid,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName
        };
    }
}