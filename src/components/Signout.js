import React from "react";
import { auth } from "../authentication/Config";
import { signOut } from "firebase/auth";

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