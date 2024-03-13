import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../authentication/Config";
import { doc, getDoc } from "firebase/firestore";
import { Navbar } from '../components/Navbar'
import { Link } from "react-router-dom";
import { Chat } from '../chat/ChatContext';
import { Button } from 'react-bootstrap';
import { ProductReport } from '../chat/ProductReport';

export const ProductInfo = () => {
    const params = useParams()
    const [product, setProduct] = useState('');
    const { OpenChatWindow } = useContext(Chat);

    // retrieve product data using the unique product ID number
    const getProductData = async () => {
        const productTemp = await getDoc(doc(db, "products", params.productid));
        setProduct({...productTemp.data(), id: productTemp.id});
    }
    useEffect(() => {
        getProductData()
    }, [])

    // display product information (name, description, price, category, seller, chat button)
    return (
        <div>
            <Navbar />
            <br />
            <div className="product-page">
            <div className='product-img'>
                <img src={product.url} alt='product-img' />
            </div>
            <ProductReport product={product} className="report-product"/>
            <div className='product-name'>{product.name}</div>
            <div className='product-seller'>
                Sold by: <Link to={`/profile/${product.sellerID}`}>{product.seller}</Link>
            </div>
            <div className='product-description'>Product Description: {product.description}</div>
            <div className='product-category'>Category: {product.category}</div>
            <div className='product-price'>Price: ${product.price}</div>
            <div className=''><Button onClick={(e) => { OpenChatWindow(product) }}>Chat With {product.seller}</Button></div>
            <div className='float-end'></div></div>
        </div>
    )
}

