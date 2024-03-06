import React, { useState, useEffect } from 'react'
import { collection, query, getDocs, doc, orderBy} from "firebase/firestore"
import { db } from "../authentication/Config";
import { Products } from '../components/Products';
import { Navbar } from '../components/Navbar'

const Found = ({ searching }) => {
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

    // function that filters the products based on search input
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.name && product.name.toLowerCase().includes(searching.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searching, products]);

    return (
        <div>
          {filteredProducts.length > 0 && ( // At least one match
            <div className="container-fluid">
              <h1>Products</h1>
              <div className="products-box">
                <Products products={filteredProducts} />
              </div>
            </div>
          )}
          {filteredProducts.length < 1 && ( // no matches
            <div className="container-fluid">
                <h1>No matches...</h1>
            </div>
          )}
        </div>
    );
};  

const Search = () => {
    const [input, setInput] = useState('');
    const [searching, setSearching] = useState('');

    return (
    <div>
        <Navbar />
        <h2>Search</h2>
        <div>
            <input placeholder="Type to search..." type="text" className="searchBar" onChange={(e) => setInput(e.target.value)}/>
            <button onClick={() => {setSearching(input)}}>Search</button>
        </div>
        <div>
            {searching && <Found searching={searching} />}
        </div>
    </div>
    );
};

export default Search;