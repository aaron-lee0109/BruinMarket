//Navbar.js

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../authentication/Config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Chat } from "../chat/ChatContext";
import { navItems } from "./CategoryItems";
import { Signout } from "./Signout";
import { Dropdown } from "./Dropdown";

export const Navbar = () => {
  const { OpenChatWindow } = useContext(Chat); // for chat
  const [profileLink, setProfileLink] = useState('');
  const [dropdown, setDropdown] = useState(false);

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
    /*
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
    */
    <>
      <nav className="nav">
          <a href="/" className="name">
            <img src="img/logo.png" className="logo" />
          </a>
            
          <ul className="nav-items">
            {navItems.map((item) => {
            if (item.title === "Home") {
                  return (
                    <li key={item.id} className={item.cName}>
                    <Link to={item.path}>{item.title}</Link>
                </li>
                  );
              }
              if (item.title === "Categories") {
                return (
                  <li 
                    key={item.id}
                    className={item.cName}
                    class="dropdown"
                    onMouseEnter={() => setDropdown(true)}
                    onMouseLeave={() => setDropdown(false)}
                  >
                    <Link to={item.path}>{item.title}</Link>
                    {dropdown && <Dropdown />}
                  </li>
                );
              }
              return (
                <li key={item.id} className={item.cName} class="dropdown">
                  <Link to={item.path}>{item.title}</Link>
                </li>
              );
            })}
          </ul>
          <Link to={profileLink} className="nav-link">
            Profile
          </Link>
          <Link onClick={OpenChatWindow} className="nav-link">
            Chat
          </Link>
          <Signout />
      </nav>
    </>
  );
};
