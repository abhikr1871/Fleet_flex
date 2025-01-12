import Home1 from "./components/home/Home1";
import Login from "./components/login_page/Login";
import Sign_up from "./components/Sign_up/Sign_up";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home1 />} />
          <Route path="/signup" element={<Sign_up />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
