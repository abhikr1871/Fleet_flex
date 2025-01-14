import React from "react";
import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider
import Home1 from "./components/home/Home1";
import Login from "./components/login_page/Login";
import Sign_up from "./components/Sign_up/Sign_up";
import Login_captain from "./components/login_page/Login_captain";
import Sign_up_captains from "./components/Sign_up/Sign_up_captains";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <AuthProvider> {/* Wrap everything with AuthProvider */}
        <Router>
          <Routes>
            <Route exact path="/" element={<Home1 />} />
            <Route path="/signup" element={<Sign_up />} />
            <Route path="/login" element={<Login />} />
            <Route path="/captain_login" element={<Login_captain />} />
            <Route path="/captain_sign_up" element={<Sign_up_captains />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
