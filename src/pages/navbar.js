import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import CartPanel from './cartpanel'; // Corrected import
import { Link, useNavigate } from 'react-router-dom';
import '../style/navbar.css';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false); // Initialize state

  const openCartPanel = () => {
    setIsCartOpen(true);
  };

  const closeCartPanel = () => {
    setIsCartOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="path_to_your_logo" alt="Logo" />
        <div className="navbar-brand">
          <h1>PrestinDecor</h1>
          <p>FURNITURE</p>
        </div>
      </div>
      <ul className="navbar-links">
        <li><a href="#" className="active">Home</a></li>
        <li><a href="#">Products</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>
      <div className="navbar-icons">
        <a href="#"><img src="path_to_user_icon" alt="User" /></a>
        <a href="#"><img src="path_to_cart_icon" alt="Cart" onClick={openCartPanel} /></a>
      </div>
      {isCartOpen && ReactDOM.createPortal(
        <CartPanel isOpen={isCartOpen} onClose={closeCartPanel} />,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
