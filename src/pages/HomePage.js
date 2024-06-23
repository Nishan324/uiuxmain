import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Our Furniture Store</h1>
      <nav>
        <ul>
          <li><Link to="/category/Living Room">Living Room</Link></li>
          <li><Link to="/category/Dining Room">Dining Room</Link></li>
          <li><Link to="/category/Bedroom">Bedroom</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
