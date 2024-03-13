import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../authentication/Config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Chat } from "../chat/ChatContext";
import { navItems } from "./CategoryItems";
import { Signout } from "./Signout";
import { Dropdown } from "./Dropdown";

export const Navbar = () => {
  const { OpenChatWindow } = useContext(Chat);
  const [profileLink, setProfileLink] = useState('');
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
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
    <>
      <nav className="nav">
          <a href="/" className="name">
            <img src="../img/logo.png" className="logo" />
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
                    onMouseEnter={() => setDropdown(true)}
                    onMouseLeave={() => setDropdown(false)}
                  >
                    <Link to={item.path}>{item.title}</Link>
                    {dropdown && <Dropdown />}
                  </li>
                );
              }
              return (
                <li key={item.id} className={item.cName}>
                  <Link to={item.path}>{item.title}</Link>
                </li>
              );
            })}
          </ul>
          <Link onClick={OpenChatWindow} className="nav-link">
            Chat
          </Link>
          <Link to={profileLink} className="nav-link">
            Profile
          </Link>
        <div class="search-signout">
          <Signout />
          <Link to="/search" className="nav-link">
            <img
                 src="/img/search.png"
                />
          </Link>
        </div>
      </nav>
    </>
  );
};
