import admin from "firebase-admin"

const svc = process.env.FIREBASE_SERVICE_ACCOUNT
if (!svc) throw new Error("FIREBASE_SERVICE_ACCOUNT not set")

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(svc)),
  })
}

export const db = admin.firestore()


