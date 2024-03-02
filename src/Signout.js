import React from "react";
import { auth } from "./Config";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
// maybe add a Signout.css

export const Signout = () => {

    const handleSignOut = (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
        });
      }

    return (
        <button onClick={handleSignOut} class="signout">Sign Out</button>
    );
}