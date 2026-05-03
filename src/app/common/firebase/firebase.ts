import path from "node:path";
import fs from "node:fs";
import admin from "firebase-admin";
import { env } from "../../../db/env.js";

const defaultServiceAccountPath = path.resolve(
  process.cwd(),
  "src/app/common/firebase/serviceAccountKey.json",
);

const serviceAccount = env.FIREBASE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON)
  : JSON.parse(
      fs.readFileSync(
        env.FIREBASE_SERVICE_ACCOUNT_PATH ?? defaultServiceAccountPath,
        "utf8",
      ),
    );

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
