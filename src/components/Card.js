import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const DEFAULT_IMAGE_URL = '/assets/images/default-photo.jpg';

function Card() {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = useContext(CartContext);
  const [users, setUsers] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://akata-marketplace.goavana.com/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleClearCart = () => {
    confirmAlert({
      title: ' Vider le panier',
      message: 'voulez-vous tous supprimer.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => clearCart()
        },
        {
          label: 'No',
        }
      ],
    });
  };

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

  const getProductCountInCart = () => {
    let count = 0;
    cartItems.forEach((item) => {
      count += item.quantity;
    });
    return count;
  };

  const getUserById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : '';
  };

  const getProductsByUser = () => {
    const productsByUser = {};

    cartItems.forEach((item) => {
      const userId = item.product.users_id.id;
      if (!productsByUser[userId]) {
        productsByUser[userId] = {
          user: getUserById(Number(userId)),
          products: [],
          totalPrice: 0,
        };
      }
      productsByUser[userId].products.push(item);
      productsByUser[userId].totalPrice += item.product.price * item.quantity;
    });

    return productsByUser;
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div>
      <Button className='round' onClick={toggleCart}><span>{getProductCountInCart()}</span></Button>

      {isCartOpen && cartItems.length > 0 && (
        <div className='productcount'>
          <h5> Panier </h5>

          {Object.entries(getProductsByUser()).map(([userId, userData]) => (
            <div key={userId}>
              {/* <span>Vendeur <b>{userData.user}</b></span> */}
              <ul>
                {userData.products.map((item, index) => (
                  <li key={index}>
                    <div className='d-flex bordered-bottom'>
                      <div  className='images-part px-2'>
                        <img
                          alt={item?.product?.title}
                          src={
                            item?.product?.image?.url
                              ? `https://akata-marketplace.goavana.com/${item.product.image.url}`
                              : DEFAULT_IMAGE_URL
                          }
                        />
                      </div>
                      <div className='articles-desc py-2'>
                        <Link to={`/products/${item.product.id}`}>
                          <span> <b>{item.quantity} {item.product.title}</b></span>
                        </Link>
                        <br />
                        <span>
                          {calculateTotalProd(item.product.id)} <small> Ar</small>{' '}
                        </span>
                        <br />
                        <div className='delete'>
                        <div className='compteur py-2'>
                          <Button onClick={() => decrementQuantity(item.product)}>-</Button>
                          <span>{item.quantity}</span>
                          <Button onClick={() => incrementQuantity(item.product)}>+</Button>
                        </div>
                        <div className='compteur py-2 px-0'>
                        <Button onClick={() => removeFromCart(item.product)}>Supprimer</Button>
                        </div>                      
                      </div>
                      </div>
                      
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className='text-right'>
            <b> Total: {calculateTotalPrice()} Ar</b>
          </div>

          <div  className='py-3 d-flex justify-content-between'>
            <Link className='px-2' to="/panier">Voir Panier</Link>
            <Button  onClick={handleClearCart}>Vider le panier</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
