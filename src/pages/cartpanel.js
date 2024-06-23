import React, { useEffect, useState } from 'react';
import { collection, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
import '../style/cartpanel.css'; // Import CSS for CartPanel

const CartPanel = ({ isOpen, onClose }) => {
    const navigate = useNavigate(); // Get the navigate function
    const [user] = useAuthState(auth);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const fetchCartItems = async () => {
        if (!user) {
            console.log('User not logged in. Unable to fetch cart items.');
            return;
        }

        try {
            const cartsRef = collection(db, 'carts');
            const userCartQuery = query(cartsRef, where('userId', '==', user.uid));
            const userCartSnapshot = await getDocs(userCartQuery);

            if (!userCartSnapshot.empty) {
                const userCartDoc = userCartSnapshot.docs[0];
                const userCartItemsRef = collection(db, 'carts', userCartDoc.id, 'items');

                const userCartItemsSnapshot = await getDocs(userCartItemsRef);
                const userCartItems = userCartItemsSnapshot.docs.map((doc) => {
                    const itemData = doc.data();
                    return {
                        ...itemData,
                        id: doc.id,
                    };
                });

                console.log('User Cart Items:', userCartItems);
                setCartItems(userCartItems);

                const newTotalPrice = userCartItems.reduce((total, item) => {
                    return total + item.price * item.quantity;
                }, 0);
                setTotalPrice(newTotalPrice);
            } else {
                console.log('User has no cart.');
                setCartItems([]);
                setTotalPrice(0);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error.message);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        if (!user) {
            console.log('User not logged in. Unable to remove item from the cart.');
            return;
        }

        try {
            const userCartRef = collection(db, 'carts');
            const userCartQuery = query(userCartRef, where('userId', '==', user.uid));
            const userCartSnapshot = await getDocs(userCartQuery);

            if (!userCartSnapshot.empty) {
                const userCartDoc = userCartSnapshot.docs[0];
                const userCartItemsRef = collection(db, 'carts', userCartDoc.id, 'items');

                const itemToRemoveQuery = query(userCartItemsRef, where('productId', '==', productId));
                const itemToRemoveSnapshot = await getDocs(itemToRemoveQuery);

                if (!itemToRemoveSnapshot.empty) {
                    const itemToRemoveDoc = itemToRemoveSnapshot.docs[0];
                    await deleteDoc(itemToRemoveDoc.ref);

                    console.log('Item removed from cart');
                    fetchCartItems();
                } else {
                    console.log('Item not found in the cart.');
                }
            } else {
                console.log('User has no cart.');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error.message);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [user]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="cart-panel-overlay">
            <div className="cart-panel">
                <button className='close_button' onClick={onClose}>Close</button>
                <h2>Your Cart</h2>
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.id} className="cart-item">
                            <div className="cart-item-box">
                                <img src={item.image} alt={item.productName} className="cart-item-image"/>
                                <div className="cart-item-details">
                                    <p>{item.productName}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: {item.price}</p>
                                </div>
                            </div>
                            <button className="remove_btn" onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <p>Total Price: {totalPrice}</p>
                <div className="button-container99">
                    <button className='buy_button' onClick={() => navigate('/delivery')}>Buy Now</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CartPanel;
