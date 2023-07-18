import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";

function App() {
  const { state } = useContext(AuthContext);

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return state.currentUser ? children : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
