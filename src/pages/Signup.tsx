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
    <div className="flex w-full h-screen items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="flex w-1/4 justify-center flex-col bg-white p-20 gap-y-5"
      >
        <h3 className="font-semibold text-2xl">Sign up</h3>

        <div className="input-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            className="input"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            className="input"
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
        </div>

        <div className="input-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            className="input"
            placeholder="Enter yout password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="h-4 flex items-center -mt-4">
          <span className="text-red-600 text-sm self-center">{error}</span>
        </div>

        <button className="btn -mt-2" type="submit">
          {isLoading ? "Signing up..." : "Sign up"}
        </button>

        <p>
          Already have an account?{" "}
          <button
            className="text-blue-700 ml-1 underline font-medium"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}
