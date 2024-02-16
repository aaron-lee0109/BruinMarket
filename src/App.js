//App.js

import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './styles.css'
import { Home } from './Home'
import { AddProduct } from './AddProduct'
import Authentication from './Authentication';
import Register from './Register';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='authentication' element={<Authentication />} />
        <Route path='register' element={<Register />} />
        <Route path='addproduct' element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
