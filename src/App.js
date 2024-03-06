//App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import { Home } from "./pages/Home";
import Profile from "./pages/Profile";
import { AddProduct } from "./pages/AddProduct";
import Authentication from "./authentication/Authentication";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthContext } from './authentication/AuthContext';
import PrivateRoute from "./authentication/PrivateRoute"
import { ChatContext } from "./chat/ChatContext";
import Search from "./pages/Search";
import { ProductInfo } from "./pages/ProductInfo";
import { Category } from "./pages/Category";

const App = () => {
  return (
    <AuthContext>
      <ChatContext>
        <BrowserRouter>
          <Routes>
            <Route path="/" element= {<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="authentication" element={<Authentication />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="resetpassword" element={<ForgotPassword />} />
            <Route path="profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="addproduct" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
            <Route path="search" element={<PrivateRoute><Search /></PrivateRoute>} />
            <Route path="productinfo/:productid" element={<PrivateRoute><ProductInfo /></PrivateRoute>} />
            <Route path="category/:categType" element={<PrivateRoute><Category /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </ChatContext>
    </AuthContext>
  );
};

export default App;
