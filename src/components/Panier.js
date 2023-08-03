import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { Container } from 'react-bootstrap';
import { Link } from "react-router-dom";


const DEFAULT_IMAGE_URL = '/assets/images/default-photo.jpg';

function CartPage() {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity } = useContext(CartContext);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });
    return totalPrice;
  };

  const calculateTotalProd = (productId) => {
    const cartItem = cartItems.find((item) => item.product.id === productId);
    if (cartItem) {
      return cartItem.product.price * cartItem.quantity;
    }
    return 0;
  };

  return (
    <div>
      <Container className='py-5'>
        <h1>Panier</h1>
        {cartItems.length > 0 ? (
          <div>
            {cartItems.map((item, index) => (
              <div key={index} className='cart-item'>
                <img
                  width="150"
                  height="150"
                  alt={item?.product?.title}
                  src={
                    item?.product?.image?.url
                      ? `https://akata-marketplace.goavana.com/${item.product.image.url}`
                      : DEFAULT_IMAGE_URL
                  }
                />
                <div className='description px-2'>
                  <span><b>{item.product.title}</b></span><br/>
                  <span>{item.product.price} Ar</span>
                </div>
                <div className='quantity-buttons px-2'>
                  <button onClick={() => decrementQuantity(item.product)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item.product)}>+</button>
                </div>
                <div className='subtotal px-2'>
                  {calculateTotalProd(item.product.id)} Ar
                </div>
                <div>
                  <button className='btn' onClick={() => removeFromCart(item.product)}>Supprimer</button>
                </div>
              </div>
            ))}
            <div className='totalprice text-center py-4'>
              <span>
                <b>Total dans le panier: </b> {calculateTotalPrice()} Ar
              </span>
              <br/>
            </div>
          </div>
        ) : (
          <div>
            <h2>Votre panier est vide</h2>
            
            <div className='panier'>
              <Link to="/ProductList">Revenir a la liste des produits</Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default CartPage;
