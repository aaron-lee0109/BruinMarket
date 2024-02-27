//Navbar.js

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "./Config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Chat } from "./ChatContext";

export const Navbar = () => {
  const { OpenChatWindow } = useContext(Chat); // for chat
  const[profileLink, setProfileLink] = useState('');

  useEffect(() => {
    // there was an issue where auth.currentUser.uid was causing an error when a user is not logged in. So I added a conditional checking first if we are logged in, and then setting the profile link accordingly. If we're not logged in, i just made it so that it redirects to the login page
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setProfileLink(`/profile/${auth.currentUser.uid}`);
      } else {
        setProfileLink("/authentication");
      }
    });
  }, [])


  const handleSignOut = (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

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
          <button onClick={handleSignOut}>Sign Out</button>
          <Link to={profileLink} className="nav-link">
            Profile
          </Link>
          <Link to="/addproduct" className="nav-link">
            Add Product
          </Link>
          <Link to="/search" className="nav-link">
            Search
          </Link>
          <Link onClick={OpenChatWindow} className="nav-link">
            Chat
          </Link>
        </div>
      </nav>
    </div>
  );
};
