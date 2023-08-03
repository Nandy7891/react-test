import React, {createContext,useState,useEffect} from 'react';

export const CartContext = createContext();
export const CartProvider = (props) => {

    
    const [cartItems, setCartItems] = useState([]);

    // preservation des fichier a partir du stockage local

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);


    //ajouter au panier
    const addToCart = (product, quantity) => {
        const existingItem = cartItems.find((item) => item.product.id === product.id);
        if (existingItem) {
            return;
        }

        const updatedCart = [...cartItems, { product, quantity }]; 
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        setCartItems(updatedCart);
    };

    //suproimer du pannier
    const removeFromCart = (product) => {
        const updatedCartItems = cartItems.filter((item) => item.product.id !== product.id);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    };


    const updateCartItem = (product, quantity) => {
        const updatedCartItems = cartItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity} : item
        );

        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    };

    // effacer tout
    const clearCart = () => {
        localStorage.removeItem('cart');
        setCartItems([]);
    };

    const decrementQuantity = (product) => {
        const existingItem = cartItems.find((item) => item.product.id === product.id);
        if (existingItem && existingItem.quantity > 1) {
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity - 1,
            };
            const updatedCartItems = cartItems.map((item) =>
                item.product.id === product.id ? updatedItem : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            setCartItems(updatedCartItems);
        }
    };

    const incrementQuantity = (product) => {
        const existingItem = cartItems.find((item) => item.product.id === product.id);
        if (existingItem) {
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + 1,
            };
            const updatedCartItems = cartItems.map((item) =>
                item.product.id === product.id ? updatedItem : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            setCartItems(updatedCartItems);
        }
    };


    return ( 
    <CartContext.Provider value = {{cartItems, addToCart, removeFromCart, clearCart, decrementQuantity, incrementQuantity, updateCartItem } } >
        { props.children} 
        </CartContext.Provider>
    );
};

export default CartProvider;