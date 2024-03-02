import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, getDocs, where, collection, query } from "firebase/firestore";
import { db, auth } from './Config';
import { Products } from "./Products";
import { Navbar } from './Navbar';
import { ProfileReport } from './ProfileReport';
import { setDocProfile, docProfile } from "firebase/firestore";
import { updateProfile } from 'firebase/auth';

const Profile = () => {
  const { userId } = useParams(); // Get the user ID from the URL params
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
    //These functions do not work yet
    function updateBio() {
        updateProfile(auth.currentUser, {
            displayName: "test",
        });
    }
    function updateName() {
        updateProfile(auth.currentUser, {
            displayName: "test",
        });
    }
    
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
  let productTitle = "";
  if (auth.currentUser.uid === userId) {
    profileTitle = "Your Profile"
    productTitle = "Your Products"
  } else {
    profileTitle = `${profile?.name}'s Profile`
    productTitle = `${profile?.name}'s Products`
  }

  const getProducts = async () => {
    const q = query(collection(db, "products"), where ("sellerID", "==", userId));
    const querySnapshot = await getDocs(q);
    const productsArray = [];
    querySnapshot.forEach((doc) => {
      productsArray.push({ ...doc.data(), id: doc.id });
    });
    setProducts(productsArray);
  };
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <section className='user-info'>
        <h2>{profileTitle}</h2>
        {profile ? (
          <div>
            <p>Name: {profile.name}</p>
            <p>Bio: {profile.bio ? profile.bio : "User has no bio :("}</p>
            {/* Additional profile information can be displayed here */}
    <button onClick={updateName}>Update Name</button>
 <input type="text" name="popup" id="popup" class="hide"></input> <br/>
    <button onClick={updateBio}>Update Bio</button>
    <input type="text" name="popup" id="popup" class="hide"></input>          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </section>
      <section className='user-products'>
        {products.length > 0 && ( // if we have at least 1 product, then display those products on our homepage
          <div className="container-fluid">
            <h2>{productTitle}</h2>
            <div className="products-box">
              <Products products={products} />
            </div>
          </div>
        )}
        {products.length < 1 && ( // if we don't have any or loading, then display "please wait"
          <div className="container-fluid">Please wait...</div>
        )}
      </section>
      <div className='float-end'><ProfileReport profile={profile}/></div>
    </div>
  );
};

export default Profile;
