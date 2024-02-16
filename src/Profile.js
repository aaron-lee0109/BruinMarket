import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './Config';
import { Navbar } from './Navbar';

const Profile = () => {
  const { userId } = useParams(); // Get the user ID from the URL params
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch user profile data from Firestore based on user ID
        const profileDoc = await db.collection('profiles').doc(userId).get();
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

  return (
    <div>
      <Navbar />
      <h2>Profile</h2>
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
