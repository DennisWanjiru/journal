import { useNavigate } from "react-router-dom";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { SyntheticEvent, useContext, useEffect, useState } from "react";

import { JournalType } from "../types";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config/firebase";
import classNames from "classnames";

export default function Home() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { state, dispatch } = useContext(AuthContext);
  const { currentUser } = state;

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
  }, [showSuccess]);

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
      setShowSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <nav className="flex w-full relative justify-between bg-pink-500 items-center py-5 px-10 text-white">
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

      <div
        className={classNames(
          "bg-teal-100 border-l-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md absolute top-20 right-0 mt-2 opacity-0",
          {
            "opacity-100": showSuccess,
          }
        )}
        role="alert"
      >
        <div className="flex items-center">
          <div>
            <p className="font-bold">Success: Your journal was sent.</p>
            <p className="text-sm">
              You will receive a journal tomorrow at 12PM from your fellow
              journaler
            </p>
          </div>

          <span className="ml-4 py-3" onClick={() => setShowSuccess(false)}>
            <svg
              className="fill-current h-6 w-6 text-teal-600"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
}
