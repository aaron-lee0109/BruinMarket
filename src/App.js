//App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import { Home } from "./Home";
import Profile from "./Profile";
import { AddProduct } from "./AddProduct";
import Authentication from "./Authentication";
import Register from "./Register";
import { AuthContext } from './AuthContext';
import PrivateRoute from "./PrivateRoute"
import { ChatContext } from "./ChatContext";
import Search from "./Search";
import { ProductInfo } from "./ProductInfo";
import { Category } from "./Category";

const App = () => {
  return (
    <AuthContext>
      <ChatContext>
        <BrowserRouter>
          <Routes>
            <Route path="/" element= {<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="authentication" element={<Authentication />} />
            <Route path="register" element={<Register />} />
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
