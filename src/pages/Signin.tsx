import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [password, email]);

  const onSubmit = async (e: SyntheticEvent) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      const res = await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: "SIGNIN", payload: res.user });
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error?.code === "auth/wrong-password" ||
        error?.code === "auth/user-not-found"
          ? "Incorrect credentials"
          : "Something went wrong! Try again later.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex w-1/4 justify-center flex-col ">
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
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
