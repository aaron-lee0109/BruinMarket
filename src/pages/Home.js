import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Products } from "../components/Products";
import { db } from "../authentication/Config";
import { collection, getDocs } from "firebase/firestore";

export const Home = () => {
  // create the array of products we're going to display
  const [products, setProducts] = useState([]);

  // create a function that will retrieve all the products in our database, and store them in our array
  const getProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
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
      <section class="header">
        <div class="header-top">
          <h1 class="header-h1">
            The one-stop shop to buy and sell items on the UCLA campus.
          </h1>
        </div>
        <div class="homeButtons">
          <a href="/search" class="left">Find Product</a> 
          <a href="/addproduct" class="right">
            Add Product
          </a>
        </div>
      </section>

      {products.length > 0 && ( // if we have at least 1 product, then display those products on our homepage
        <div className="container-fluid">
          <h1 className="text-center all-products">All Products</h1>
          <div className="products-box">
            <Products products={products} />
          </div>
        </div>
      )}
      {products.length < 1 && ( // if we don't have any or loading, then display "please wait"
        <div className="container-fluid">Please wait...</div>
      )}
    </div>
  );
};
