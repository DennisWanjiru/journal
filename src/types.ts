import { type Timestamp } from "firebase/firestore";

export interface UserType {
  name: string;
  email: string;
  journaledToday: boolean;
}

export interface JournalType {
  content: string;
  authorId: string;
  timestamp: Timestamp;
}
