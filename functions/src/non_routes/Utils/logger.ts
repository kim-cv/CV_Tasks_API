'use strict'

import * as VError from 'verror';


export const error = (message: VError) => {
    console.error(message);
}

export const info = (message: string) => {
    console.info(message);
}
export const debug = (message: string) => {
    console.info(message);
}