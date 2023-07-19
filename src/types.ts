import { type Timestamp } from "firebase/firestore";

export interface UserType {
  name: string;
  email: string;
}

export interface JournalType {
  content: string;
  authorId: string;
  authorEmail: string;
  timestamp: Timestamp;
}
