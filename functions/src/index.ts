'use strict';

// Firebase
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// ExpressJS
import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser'; // for parsing application/json

// Utils
import assert = require('assert');
import { IsJson } from './non_routes/Utils/Utils';
import * as DefaultHTTPSErrors from './non_routes/HTTPErrors/DefaultHTTPSErrors';

// Routes
import { user_router } from "./user/routes";
import { task_router } from "./task/routes";

const app = express();

app.use((req, res, next) => {
    assert.notStrictEqual(typeof req, 'undefined');
    assert.notStrictEqual(req, null);
    assert.notStrictEqual(typeof res, 'undefined');
    assert.notStrictEqual(res, null);
    next();
});
app.use(bodyParser.json());

app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const result = IsJson(req.body);
        if (result) {
            next();
        } else {
            res.status(500).json(DefaultHTTPSErrors.data_not_json());
        }
    } else {
        next();
    }
});

app.use(cors({ origin: true }));

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Add routes
app.use("/users", user_router);
app.use("/tasks", task_router);

// Apply ExpressJS app onto Firebase functions
const api = functions.https.onRequest(app);

// Export API
module.exports = {
    api
}