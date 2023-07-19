import { shuffle } from "lodash";
import sendEmail, { Options } from "./sendEmail";
import { Timestamp } from "firebase-admin/firestore";

export interface Journal {
  content: string;
  authorId: string;
  authorEmail: string;
  timestamp: Timestamp;
}

export default function distributeJournals(journals: Journal[]): void {
  const shuffledJournals = shuffle(journals);

  for (const journal of shuffledJournals) {
    const eligibleJournals = journals.filter(
      (entry) => entry.authorId !== journal.authorId
    );

    if (eligibleJournals.length > 0) {
      const randomJournal = getRandomJournal(eligibleJournals);

      // Send the journal to the current user
      const mail: Options = {
        to: journal.authorEmail,
        text: randomJournal.content,
      };

      sendEmail(mail);
    } else {
      console.log(
        `No eligible journal available to send to author ${journal.authorId}.`
      );
    }
  }
}

function getRandomJournal(journals: Journal[]): Journal {
  const randomIndex = Math.floor(Math.random() * journals.length);
  return journals[randomIndex];
}

// function shuffleArray<T>(array: T[]): T[] {
//   const newArray = [...array];

//   for (let i = newArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }

//   return newArray;
// }
