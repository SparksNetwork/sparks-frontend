import * as admin from 'firebase-admin';

const serviceAccount = require(process.env.FIREBASE_ADMINSDK_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
