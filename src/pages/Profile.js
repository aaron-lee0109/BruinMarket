import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, getDoc, getDocs, where, collection, query } from "firebase/firestore";
import { db, auth } from '../authentication/Config';
import ProfileProducts from "../components/ProfileProducts";
import { Navbar } from '../components/Navbar';
import { ProfileReport } from '../chat/ProfileReport';
import { getAuth, updateProfile } from "firebase/auth";

const Profile = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newBio, setNewBio] = useState('');

    const auth = getAuth();

    function updateBio() {
        if (auth.currentUser) {
            const userDocRef = doc(db, "profiles", auth.currentUser.uid);
            updateDoc(userDocRef, {
                bio: newBio
            }).then(() => {
                setProfile(prevState => ({...prevState, bio: newBio}));
            }).catch((error) => {
                console.error("Error updating bio:", error.message);
            });
        } else {
            console.log("No user logged in");
        }
    }
    
    function updateName() {
        if (auth.currentUser) {
            updateProfile(auth.currentUser, {
                displayName: newName,
            }).then(() => {
                setProfile(prevState => ({
                    ...prevState,
                    name: newName,
                }));
                setNewName('');
            }).catch((error) => {
                console.error("Error updating name:", error.message);
            });
        } else {
            console.log("No user logged in");
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileDoc = await getDoc(doc(db, "profiles", userId));
                if (profileDoc.exists) {
                    setProfile(profileDoc.data());
                } else {
                    console.error('User profile not found');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        };
        
        fetchProfile();
    }, [userId]);

    let profileTitle = "";
    let productTitle = "";
    if (auth.currentUser.uid === userId) {
        profileTitle = "Your Profile";
        productTitle = "Your Products";
    } else {
        profileTitle = `${profile?.name}'s Profile`;
        productTitle = `${profile?.name}'s Products`;
    }

    const getProducts = async () => {
        const q = query(collection(db, "products"), where("sellerID", "==", userId));
        const querySnapshot = await getDocs(q);
        const productsArray = [];
        querySnapshot.forEach((doc) => {
            productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProducts(productsArray);
    };

    useEffect(() => {
        getProducts();
    }, [userId]);

    return (
        <div>
            <Navbar />
            <section className='user-info'>
                <h2>{profileTitle}</h2>
                <ProfileReport profile={profile}/>
                {profile ? (
                    <div>
                        <p>Name: {profile.name}</p>
                        <p>Bio: {profile.bio ? profile.bio : "User has no bio :("}</p>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter new name"
                        />
                        <button onClick={() => updateName()}>Update Name</button>

                        <input
                            type="text"
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            placeholder="Enter new bio"
                        />
                        <button onClick={() => updateBio()}>Update Bio</button>
                    </div>
                ) : (
                    <p>Loading profile...</p>
                )}
            </section>
            <section className='user-products'>
                {products.length > 0 && (
                    <div className="container-fluid product-boxes">
                        <h2 class="header2">{productTitle}</h2>
                        <div className="products-box">
                            <ProfileProducts products={products} UID={userId}></ProfileProducts>
                        </div>
                    </div>
                )}
                {products.length < 1 && (
                    <div className="container-fluid whitetext">No products yet!</div>
                )}
            </section>
        </div>
    );
};

export default Profile;