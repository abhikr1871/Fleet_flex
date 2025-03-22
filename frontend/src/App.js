import React, { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home1 from "./components/home/Home1";
import Login from "./components/login_page/Login";
import Sign_up from "./components/Sign_up/Sign_up";
import Login_captain from "./components/login_page/Login_captain";
import Sign_up_captains from "./components/Sign_up/Sign_up_captains";
import Main_home from "./components/main_home/Home1";
import CaptainDashboard from "./components/captain_dahboard/CaptainDashboard";

const RedirectToDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "captain") {
        navigate("/CaptainDashboard"); // Redirect captain
      } else {
        navigate("/Main_home"); // Redirect user
      }
    }
  }, [navigate]);

  return null; // No need to render anything, just handle redirection
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <RedirectToDashboard /> {/* Runs redirection logic on page load */}
          <Routes>
            <Route exact path="/" element={<Home1 />} />
            <Route path="/signup" element={<Sign_up />} />
            <Route path="/login" element={<Login />} />
            <Route path="/captain_login" element={<Login_captain />} />
            <Route path="/captain_sign_up" element={<Sign_up_captains />} />
            <Route exact path="/Main_home" element={<Main_home />} />
            <Route path="/CaptainDashboard" element={<CaptainDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
