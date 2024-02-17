//App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";
import { Home } from "./Home";
import Profile from "./Profile";
import { AddProduct } from "./AddProduct";
import Authentication from "./Authentication";
import Register from "./Register";
import { AuthProvider } from './AuthContext';
import PrivateRoute from "./PrivateRoute"

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element= {<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="authentication" element={<Authentication />} />
          <Route path="register" element={<Register />} />
          <Route path="profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="addproduct" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
