// ProfileProducts.js
import React from 'react';
import { auth, db, storage } from '../authentication/Config'
import { ref, deleteObject } from 'firebase/storage'
import { collection, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";

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

    const delProduct = async (id, imgPath) => {
        const docRef = doc(db, 'products', id);
        const chatRef = query(collection(db, "chats"), where ("productId", "==", id))
        const imgRef = ref(storage, `product-images/${imgPath}`)

        deleteObject(imgRef)

        const querySnapshot = await getDocs(chatRef);
            querySnapshot.forEach((docu) => {
            const chat = doc(db, 'chats', docu.id)
            deleteDoc(chat)
        })

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
                <button className='delete-product' onClick={(e) => delProduct(item.id, item.imgPath)}>Delete Item</button>
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