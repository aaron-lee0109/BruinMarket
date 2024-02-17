//App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import { Home } from "./Home";
import Profile from "./Profile";
import { AddProduct } from "./AddProduct";
import Authentication from "./Authentication";
import Register from "./Register";
import Chats from "./views/Chats";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="authentication" element={<Authentication />} />
        <Route path="register" element={<Register />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="chat" element={<Chats />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
