//Navbar.js

import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div>
      <nav class="nav">
        <a href="/" class="name">
          <img src="img/logo.png" class="logo" />
        </a>
        <div class="links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/authentication" className="nav-link">
            Login/Register
          </Link>
          <Link to="/profile/${userId}" className="nav-link">
            Profile
          </Link>
          <Link to="/addproduct" className="nav-link">
            Add Product
          </Link>
        </div>
      </nav>
    </div>
  );
};