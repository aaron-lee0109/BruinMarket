import React, { useState, useEffect } from 'react'
import { collection, query, getDocs, doc, orderBy} from "firebase/firestore"
import { db } from "./Config";
import { Products } from './Products';
import { Navbar } from './Navbar'

function Found({products, searching}) {
    getDocs(collection(db, "products")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
    
            const item = data.name.toLowerCase();
            const input = searching.toLowerCase();
    
            if (item.includes(input)) {
                console.log("Found");
                return (<Products products={products}></Products>);
            }
            else {
                console.log("not Found");
            }
        });
    })
}


export const Search = () => {
    const [input, setInput] = useState('');
    const [searching, setSearching] = useState('');
    const [productList, setProductList] = useState([]);
    const productRef = collection(db, "products");

    useEffect(() => {
        const getProductData = async () => {
            const q = query(productRef, orderBy("name"));
            const productData = await getDocs(q);

            const list = productData.docs.map(doc => {return {...doc.data(), id: doc.id}})
            setProductList(list);
        }
        getProductData();
    }, []);

    return (
    <div>
        <Navbar />
        <h2>Search</h2>
        <div>
            <input placeholder="Type to search..." type="text" className="searchBar" onChange={(e) => setInput(e.target.value)}/>
            <button onClick={() => {setSearching(input)}}>Search</button>
        </div>
        <div>
            <view>
                {productList.map(item => {
                    return (<Found products={item.products} searching={searching}></Found>)
                })}
            </view>
        </div>
    </div>
    )
}

export default Search;