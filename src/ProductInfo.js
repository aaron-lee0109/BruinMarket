// ProductInfo.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from "./Config";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Navbar } from './Navbar'

export const ProductInfo = () => {

    
    const params = useParams()
    const [product, setProduct] = useState('');
    const [user, setUser] = useState(null);

    // just testing out onAuthStateChanged
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          console.log(user.displayName)
          console.log(user.uid)
          console.log(user.email)
          console.log(user.emailVerified)
          // ...
        } else {
          // User is signed out
          // ...
          console.log("nothing")
        }
      });
    /*
    const getCurrentUser() {
        useEffect (() => {
            auth.onAuthStateChanged(user=>{
                if(user){
                    // first have to add users in database
                }
            })
        })
    }
    */
    const getProductData = async () => {
        const productTemp = await getDoc(doc(db, "products", params.productid));
        setProduct(productTemp.data()); 
    }
    useEffect(() => {
        getProductData()
    }, [])



    return ( // add a URL to the product.seller 
        <div>
            <Navbar />
            <br/>
            <div className='product-img'>
                <img src={product.url} alt='product-img' />
            </div>
            <div className='product-name'>{product.name}</div>
            <div className='product-seller'>
                Sold by: <a href={`/profile/${product.sellerID}`}>{product.seller}</a>
            </div>
            <div className='product-description'>Product Description: {product.description}</div>
            <div className='product-category'>Category: {product.category}</div>
            <div className='product-price'>Price: ${product.price}</div>
            <button>Request Item</button>
        </div>
    )
}

