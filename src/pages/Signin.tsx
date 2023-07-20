import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import classNames from "classnames";
import { validateEmail, validatePassword } from "../validations";

export default function Signin() {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  useEffect(() => {
    setError("");
    setEmailError(validateEmail(email));
    setPasswordError(validatePassword(password));
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
    <div className="flex w-full bg-white h-screen items-center justify-center md:bg-gray-200">
      <form
        onSubmit={onSubmit}
        className="flex 2xl:w-1/4 xl:w-1/3 lg:w-1/2 md:w-3/4 justify-center flex-col bg-white sm:p-20 gap-y-4 w-screen p-10"
      >
        <h3 className="font-semibold text-2xl">Sign in</h3>
        <div className="h-2 flex items-center">
          <span className="text-red-600 text-sm self-center">{error}</span>
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
            onChange={(e) => setEmail(e.target.value)}
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
          className="btn"
          type="submit"
          disabled={
            !email.length || !password.length || !!passwordError || !!emailError
          }
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <p>
          Do not have an account?{" "}
          <button
            className="text-blue-700 ml-1 underline font-medium"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
