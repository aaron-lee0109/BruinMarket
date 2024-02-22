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
import Chats from "./views/Chats";
import { ProductInfo } from "./ProductInfo";

const App = () => {
  return (
    <AuthContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element= {<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="authentication" element={<Authentication />} />
          <Route path="register" element={<Register />} />
          <Route path="profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="addproduct" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route path="chat" element={<PrivateRoute><Chats /></PrivateRoute>} />
          <Route path="productinfo/:productid" element={<ProductInfo />} />
      </Routes>
      </BrowserRouter>
    </AuthContext>
  );
};

export default App;
