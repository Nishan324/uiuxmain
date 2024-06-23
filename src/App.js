import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AddProductPage from './pages/AddProductPage';
import ImageUploadPage from './pages/ImageUploadPage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import Navbar from './pages/navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/signup';



function App() {
  return (
    
   
      <Router>
         <Navbar />
        <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />


          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/upload-image" element={<ImageUploadPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        
        </Routes>
      </Router>
   
  );
}

export default App;
