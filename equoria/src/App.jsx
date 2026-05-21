import "./App.css";
import Landing from "./views/Landing";
import Feed from "./views/Feed";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProfile from "./views/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

