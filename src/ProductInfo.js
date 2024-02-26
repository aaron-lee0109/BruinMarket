// ProductInfo.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "./Config";
import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
import { Navbar } from './Navbar'
import { Link } from "react-router-dom";

export const ProductInfo = () => {
    const params = useParams()
    const [product, setProduct] = useState('');
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
                Sold by: <Link to={`/profile/${product.sellerID}`}>{product.seller}</Link>
            </div>
            <div className='product-description'>Product Description: {product.description}</div>
            <div className='product-category'>Category: {product.category}</div>
            <div className='product-price'>Price: ${product.price}</div>
            <button>Request Item</button>
        </div>
    )
}

