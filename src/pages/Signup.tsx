import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { UserType } from "../types";
import { AuthContext } from "../context/AuthContext";
import { validateEmail, validateName, validatePassword } from "../validations";
import classNames from "classnames";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showNameError, setShowNameError] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
    setNameError(validateName(name));
    setEmailError(validateEmail(email));
    setPasswordError(validatePassword(password));
  }, [password, email, name]);

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
        <div className="h-2 flex items-center">
          <span className="text-red-600 text-sm self-center">{error}</span>
        </div>

        <div className="input-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            className={classNames("input", {
              "border-red-600": nameError && showNameError,
            })}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setShowNameError(!!emailError)}
          />
          <div
            className={classNames("h-2 flex items-center opacity-0", {
              "opacity-100": showNameError,
            })}
          >
            <span className="text-red-600 text-xs self-center">
              {nameError}
            </span>
          </div>
        </div>

        <div className="input-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            className={classNames("input", {
              "border-red-600": emailError && showEmailError,
            })}
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onBlur={() => setShowEmailError(!!emailError)}
          />
          <div
            className={classNames("h-2 flex items-center opacity-0", {
              "opacity-100": showEmailError,
            })}
          >
            <span className="text-red-600 text-xs self-center">
              {emailError}
            </span>
          </div>
        </div>

        <div className="input-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            className={classNames("input", {
              "border-red-600": passwordError && showPasswordError,
            })}
            placeholder="Enter yout password"
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setShowPasswordError(!!passwordError)}
          />

          <div
            className={classNames("h-2 flex items-center opacity-0", {
              "opacity-100": showPasswordError,
            })}
          >
            <span className="text-red-600 text-xs self-center">
              {passwordError}
            </span>
          </div>
        </div>

        <button
          className="btn -mt-2"
          type="submit"
          disabled={
            !name.length ||
            !email.length ||
            !password.length ||
            !!passwordError ||
            !!emailError ||
            !!nameError
          }
        >
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
