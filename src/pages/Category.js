import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../authentication/Config";
import { getDocs, where, collection, query } from "firebase/firestore";
import { Products } from "../components/Products";
import { Navbar } from '../components/Navbar'
import { Link } from "react-router-dom";

export const Category = () => {

    let { categType } = useParams(); // Get the user ID from the URL params
    if (categType == "Homekitchen") {
        categType = "Home & Kitchen"
    }
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        const q = query(collection(db, "products"), where ("category", "==", categType));
        const querySnapshot = await getDocs(q);
        const productsArray = [];
        querySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProducts(productsArray);
      };
      useEffect(() => {
        getProducts();
      }, [categType]);

    return (
        <div>
            <Navbar />
            <h1 className="category-heading">{categType} Products</h1>
            <section className='user-products'>
                {products.length > 0 && ( // if we have at least 1 product, then display those products on our homepage
                    <div className="container-fluid">
                        <div className="products-box">
                            <Products products={products} />
                        </div>
                    </div>
                )}
                {products.length < 1 && ( // if we don't have any or loading, then display "please wait"
                    <div className="container-fluid">Please wait...</div>
                )}
            </section>
        </div>
    )
}