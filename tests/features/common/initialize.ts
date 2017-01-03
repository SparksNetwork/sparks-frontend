import * as admin from 'firebase-admin';

const serviceAccount: any =
  {
    type: process.env.FIREBASE_ADMINSDK_TYPE,
    project_id: process.env.FIREBASE_ADMINSDK_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMINSDK_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_ADMINSDK_PRIVATE_KEY,
    client_email: process.env.FIREBASE_ADMINSDK_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMINSDK_CLIENT_ID,
    auth_uri: process.env.FIREBASE_ADMINDSDK_AUTH_URI,
    token_uri: process.env.FIREBASE_ADMINSDK_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_ADMINSDK_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_ADMINSDK_CLIENT_X509_CERT_URL,
  };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
