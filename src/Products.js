//Products.js

import React from 'react';

export const Products = ({products}) => {
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