import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Home } from './Home'
import { AddProduct } from './AddProduct'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='addproduct' element={<AddProduct />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
