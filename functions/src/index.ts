import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import distributeJournals, { Journal } from "./distributeJournals";

admin.initializeApp();
const db = admin.firestore();

export const taskRunner = functions.pubsub
  .schedule("00 12 * * *")
  .timeZone("Africa/Nairobi")
  .onRun(async () => {
    try {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const journalsRef = db.collection("journals");

      const journalsQuery = await journalsRef
        .where("timestamp", ">", yesterday)
        .where("timestamp", "<=", today)
        .get();

      const journals = journalsQuery.docs.map((doc) => doc.data() as Journal);

      if (journals) {
        distributeJournals(journals);
      }
    } catch (error) {
      console.log({ error });
    }
  });
