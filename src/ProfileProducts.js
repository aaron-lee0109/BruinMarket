// ProfileProducts.js
import React, { useEffect } from 'react';
import { auth, db } from './Config'
import { collection, deleteDoc, doc } from "firebase/firestore";

/*
export const ProfileProducts = ({products}) => {
    // using the products array we were passed, map those products one by one and display their image, name and price
    return products.map(item =>(
        <div key = {item.id} className='product' onClick={() => window.location.href = `/productinfo/${item.id}`}>
            <div className='product-img'>
                <img src={item.url} alt='product-img' />
            </div>
            <div className='product-name'>{item.name}</div>
            <div className='product-price'>${item.price}</div>
        </div>
    ))
}
*/


function ProfileProducts({ products, UID }){

    const delProduct = (id) => {
        const docRef = doc(db, 'products', id);
        console.log(docRef)
        deleteDoc(docRef).then(() => {
            window.location.reload();
        })
    };

    if(auth.currentUser.uid === UID){
        return products.map(item =>(
            <div>
                <div key = {item.id} className='product' onClick={() => window.location.href = `/productinfo/${item.id}`}>
                    <div className='product-img'>
                        <img src={item.url} alt='product-img' />
                    </div>
                    <div className='product-name'>{item.name}</div>
                    <div className='product-price'>${item.price}</div>  
                </div>
                <button className='delete-product' onClick={(e) => delProduct(item.id)}>Delete Item</button>
            </div>
        ))
    } else{
        return products.map(item =>(
            <div key = {item.id} className='product' onClick={() => window.location.href = `/productinfo/${item.id}`}>
                <div className='product-img'>
                    <img src={item.url} alt='product-img' />
                </div>
                <div className='product-name'>{item.name}</div>
                <div className='product-price'>${item.price}</div>
            </div>
        ))
    }
}

export default ProfileProducts