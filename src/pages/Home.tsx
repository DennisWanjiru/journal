import { useNavigate } from "react-router-dom";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { SyntheticEvent, useContext, useState } from "react";

import { JournalType } from "../types";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config/firebase";

export default function Home() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { state } = useContext(AuthContext);
  const { currentUser } = state;

  const onSubmit = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      setSubmitting(true);

      if (!currentUser) {
        navigate("/signin");
        return;
      }

      const journal: JournalType = {
        content,
        authorId: currentUser.uid,
        timestamp: Timestamp.fromDate(new Date()),
      };

      await addDoc(collection(db, "journals"), journal);
      setContent("");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <label>Journal</label>
      <textarea
        placeholder="Write your journal here ..."
        maxLength={500}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {error ? <span className="text-red-600">{error}</span> : null}

      <button
        disabled={content.length < 10}
        className="bg-purple-500 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        type="submit"
      >
        {submitting ? "Sharing..." : "Share"}
      </button>
    </form>
  );
}
