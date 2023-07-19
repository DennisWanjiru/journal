import { SyntheticEvent, useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { UserType } from "../types";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e: SyntheticEvent) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      const res = await createUserWithEmailAndPassword(auth, email, password);

      const user: UserType = {
        name,
        email,
        journaledToday: false,
      };

      await setDoc(doc(db, "users", res.user.uid), user);
      dispatch({ type: "SIGNIN", payload: res.user });
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error?.code === "auth/email-already-in-use"
          ? "Email is already taken"
          : "Something went wrong! Try again later.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex w-1/4 justify-center flex-col ">
      <label>Name</label>
      <input
        type="text"
        value={name}
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />

      <label>Email</label>
      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
      />

      <label>Password</label>
      <input
        type="password"
        value={password}
        placeholder="Enter yout password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error ? <span className="text-red-600">{error}</span> : null}
      <button className="bg-purple-500" type="submit">
        {isLoading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
