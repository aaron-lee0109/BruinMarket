//Navbar.js

import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { auth } from "./Config";
import { onAuthStateChanged } from "firebase/auth";

export const Navbar = () => {

  const[profileLink, setProfileLink] = useState('');

  useEffect(() => {
    // there was an issue where auth.currentUser.uid was causing an error when a user is not logged in. So I added a conditional checking first if we are logged in, and then setting the profile link accordingly. If we're not logged in, i just made it so that it redirects to the login page
    onAuthStateChanged(auth, (user) => {
      console.log("Navbar - onAuthStateChanged")
      if(user) {
        setProfileLink(`/profile/${auth.currentUser.uid}`);
      } else {
        setProfileLink("/authentication");
      }
    });
  }, [])

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
          <Link to={profileLink} className="nav-link">
            Profile
          </Link>
          <Link to="/addproduct" className="nav-link">
            Add Product
          </Link>
          <Link to="/search" className="nav-link">
            Search
          </Link>
          <Link to="/chat" className="nav-link">
            Chat
          </Link>
        </div>
      </nav>
    </div>
  );
};
