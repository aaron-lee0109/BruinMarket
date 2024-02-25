//Products.js

import React, { useContext } from 'react';
import { Chat } from './ChatContext'; // for chat
import { Button } from 'react-bootstrap'; // for chat

export const Products = ({products}) => {
    const { OpenChatWindow } = useContext(Chat); // for chat
    // using the products array we were passed, map those products one by one and display their image, name and price
    return products.map(item =>(
        <div key = {item.id} className='product' onClick={() => window.location.href = `/productinfo/${item.id}`}>
            <div className='product-img'>
                <img src={item.url} alt='product-img' />
            </div>
            <div className='product-name'>{item.name}</div>
            <div className='product-price'>${item.price}</div>
            <div className=''><Button onClick={(e) => { e.stopPropagation(); OpenChatWindow(item)} }>Open chat</Button></div>
        </div>
    ))
}