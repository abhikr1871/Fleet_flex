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
import VehicleSearch from "./components/Book_vehicle/VehicleSearch";
import SearchResults from "./components/Book_vehicle/SearchResults";
import UserProfile from "./components/Profile/User_profile";
import CaptainProfile from "./components/Profile/Captain_profile";
import VehicleDetails from "./components/Book_vehicle/VehicleDetails";
import Riderequests from "./components/captain_dahboard/Riderequests";
import RideRequestDetails from "./components/captain_dahboard/RideRequestDetails";
import UpcomingRides from "./components/upcoming_rides/UpcomingRides";
import UpcomingRideDetails from "./components/upcoming_rides/UpcomingRideDetails";
const RedirectToDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "captain") {
        navigate("/CaptainDashboard");
      } else {
        navigate("/Main_home");
      }
    } else {
      navigate("/home");
    }
  }, [navigate]);

  return null;
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Redirect only when accessing the root URL */}
            <Route path="/" element={<RedirectToDashboard />} />
            <Route path="/home" element={<Home1 />} />
            <Route path="/signup" element={<Sign_up />} />
            <Route path="/login" element={<Login />} />
            <Route path="/captain_login" element={<Login_captain />} />
            <Route path="/captain_sign_up" element={<Sign_up_captains />} />
            <Route path="/Main_home" element={<Main_home />} />
            <Route path="/CaptainDashboard" element={<CaptainDashboard />} />
            <Route path="/VehicleSearch" element={<VehicleSearch />} />
            <Route path="/User_profile" element={<UserProfile />} />
            <Route path="/captain_profile" element={<CaptainProfile />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/vehicle-details" element={<VehicleDetails />} />
            <Route path="/riderequests" element={<Riderequests />} />
            <Route path="/upcoming-rides" element={<UpcomingRides />} />
            <Route
              path="/upcoming-ride-details"
              element={<UpcomingRideDetails />}
            />
            <Route
              path="/ride-request-details"
              element={<RideRequestDetails />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
