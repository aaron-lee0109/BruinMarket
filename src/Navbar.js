//Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <div>
            <Link to="/" className='nav-link'>Home</Link>
            <Link to="/authentication" className='nav-link'>Login/Register</Link>
            <Link to="/addproduct" className='nav-link'>Add Product</Link>
        </div>
    );
};