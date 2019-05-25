export abstract class AbstractHTTPResponse {
    public httpCode: number;

    protected _message: any = {};
    public get message(): any {
        return this._message;
    }

    constructor (_httpCode: number) {
        this.httpCode = _httpCode;
    }

    public AddLabel(label:string, value:any){
        this._message[label] = value;
    }

    public AddObject(value:any){
        this._message = value;
    }       
}