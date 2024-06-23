import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import '../style/CategoryPage.css';

const CategoryPage = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(firestore, 'products'), where("category", "==", name));
      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    };

    fetchProducts();

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [name]);

  const toggleReadMore = (id) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };

  const addToWishlist = (id) => {
    console.log(`Added product ${id} to wishlist`);
  };

  const handleAddToCart = async (product) => {
    // Check if the user is authenticated
    if (!user) {
      alert('Please log in to add the product to the cart.');
      console.log('User not logged in. Please log in to add to cart.');
      return;
    }

    console.log('User:', user);

    const { id, name: productName, price, imageUrl } = product;
    const quantity = 1;
    alert("Product Added to cart");

    try {
      const cartsRef = collection(firestore, 'carts');
      const userCartQuery = query(cartsRef, where('userId', '==', user.uid));
      const userCartSnapshot = await getDocs(userCartQuery);

      let userCartDoc;
      if (userCartSnapshot.empty) {
        // If no cart exists for the user, create a new one
        const newCartRef = await addDoc(cartsRef, {
          userId: user.uid,
          createdAt: new Date(),
        });
        userCartDoc = newCartRef;
      } else {
        // Use the existing cart
        userCartDoc = userCartSnapshot.docs[0];
      }

      const userCartItemsRef = collection(firestore, 'carts', userCartDoc.id, 'items');
      await addDoc(userCartItemsRef, {
        productId: id,
        productName: productName,
        quantity: quantity,
        price: price || 0,
        totalprice: quantity * parseInt(price || 0),
        image: imageUrl || '',
      });

      console.log('Item added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    }
  };

  return (
    <div className="category-page">
      <h1>{name} Products</h1>
      <div className="products-container">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <h2 className="product-name">{product.name}</h2>
            <p className={`product-description ${expandedProduct === product.id ? 'full' : 'collapsed'}`}>
              {product.description}
            </p>
            {product.description.length > 100 && (
              <button className="read-more-button" onClick={() => toggleReadMore(product.id)}>
                {expandedProduct === product.id ? 'Show less' : 'Read more...'}
              </button>
            )}
            <p className="product-price">Price: NPR {isNaN(product.price) ? "0" : product.price}</p>
            <div className="action-buttons">
              <button className="action-button wishlist" onClick={() => addToWishlist(product.id)}>Wishlist</button>
              <button className="action-button cart" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
