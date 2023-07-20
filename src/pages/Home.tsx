import { useNavigate } from "react-router-dom";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { SyntheticEvent, useContext, useState } from "react";

import { JournalType } from "../types";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config/firebase";

export default function Home() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { state, dispatch } = useContext(AuthContext);
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
        authorEmail: currentUser.email as string,
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
    <>
      <nav className="flex w-full justify-between bg-pink-500 items-center py-5 px-10 text-white">
        <h1 className="md:text-3xl text-xl font-semibold">Daybreak Journal</h1>
        <button
          onClick={() => {
            dispatch({ type: "SIGNOUT" });
            navigate("/signin");
          }}
          className="md:px-5 md:py-2 px-3 md:text-base text-sm py-1 border rounded-lg bg-transparent border-white text-white hover:bg-pink-600 hover:border-transparent"
        >
          Signout
        </button>
      </nav>

      <main className="flex w-full h-screen items-center justify-center bg-white md:bg-gray-200">
        <form
          className="flex xl:w-1/3 lg:w-1/2 md:w-3/4 w-full justify-center flex-col bg-white p-10 gap-y-5"
          onSubmit={onSubmit}
        >
          <h3 className="font-semibold text-2xl">Create journal</h3>

          <div className="input-field">
            <label>Content</label>
            <textarea
              placeholder="Write your journal here ..."
              maxLength={500}
              value={content}
              className="input"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {error ? <span className="text-red-600">{error}</span> : null}

          <button disabled={content.length < 10} className="btn" type="submit">
            {submitting ? "Sharing..." : "Share"}
          </button>
        </form>
      </main>
    </>
  );
}
