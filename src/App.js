import "./App.css";
import Home from "./Components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Publish from "./Components/Publish";
import Forgotpassword from "./Components/Forgotpassword";
import Findride from "./Components/Findride";
import Ride from "./Components/Ride";
import Chats from "./Components/Chats";
import io from "socket.io-client";
import { useState, useEffect } from "react";

function App() {
  const socket = io("http://localhost:5000");

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/publishride" element={<Publish />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/findride" element={<Findride />} />
          <Route path="/ride/:slug" element={<Ride socket={socket} />} />
          <Route path="/chats" element={<Chats socket={socket} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
