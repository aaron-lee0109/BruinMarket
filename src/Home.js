import React from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
import { db } from "./Config";
import { collection, getDocs } from "firebase/firestore";

export const Home = () => {
    // create the array of products we're going to display
    const[products, setProducts] = useState([]);

    // create a function that will retrieve all the products in our database, and store them in our array
    const getProducts = async () => {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsArray = [];
        querySnapshot.forEach((doc) => {
            productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProducts(productsArray);
    } 
    useEffect(() => {
        getProducts();
    },[])

    return (
        <div>
            <Navbar />
            <br/>
            {products.length > 0 && (       // if we have at least 1 product, then display those products on our homepage
                <div className='container-fluid'>
                    <h1 className='text-center'>Products</h1>
                    <div className='products-box'>
                        <Products products={products} />
                    </div>
                </div>
            )}
            {products.length < 1 && (      // if we don't have any or loading, then display "please wait"
                <div className='container-fluid'>
                    Please wait...
                </div>
            )}
        </div>
    )
}
