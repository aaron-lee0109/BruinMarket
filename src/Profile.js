import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from './Config';
import { Navbar } from './Navbar';

const Profile = () => {
  const { userId } = useParams(); // Get the user ID from the URL params
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile data from Firestore based on user ID
        const profileDoc = await getDoc(doc(db, "profiles", userId));; // i noticed what we had before was using outdated syntax, so i updated it to the new one 
        if (profileDoc.exists) {
          setProfile(profileDoc.data());
        } else {
          console.error('User profile not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      }
    };
    
    fetchProfile(); // Call fetchProfile function when component mounts
  }, [userId]); // Re-run effect when userId changes

  // display either "Your Profile" or "Name's Profile" depending on what profile you clicked
  let profileTitle = "";
  if (auth.currentUser.uid === userId) {
    profileTitle = "Your Profile"
  } else {
    profileTitle = `${profile.name}'s Profile`
  }

  
  return (
    <div>
      <Navbar />
      <h2>{profileTitle}</h2>
      {profile ? (
        <div>
          <p>Name: {profile.name}</p>
          <p>Bio: {profile.bio}</p>
          {/* Additional profile information can be displayed here */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
