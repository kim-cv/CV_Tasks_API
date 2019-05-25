// Initialize Firebase app for unittests
import * as admin from 'firebase-admin';
import * as environment from '../environments/environment';

const serviceAccount = require('../service-account-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: environment.environment.firebase.databaseURL
});