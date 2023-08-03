import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { CartContext } from './CartContext';

const SingleProductPage = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);
  const { productId } = useParams();
  const [quantite, setQuantite] = useState(1);
  const { cartItems, removeFromCart, addToCart, incrementQuantity, decrementQuantity } = useContext(CartContext);

  const fetchProduct = async () => {
    try {
      const response = await fetch('https://akata-marketplace.goavana.com/products?_start=0&_limit=10&_sort=created_at:desc');
      const data = await response.json();
      const filteredProduct = data.filter((product) => product.id == productId);
      if (filteredProduct.length > 0) {
        setProduct(filteredProduct[0]);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const productInCart = cartItems.find((item) => item.product.id === product?.id);
    if (productInCart) {
      setQuantite(productInCart.quantity);
    } else {
      setQuantite(1);
    }
  }, [cartItems, product]);

  const imageUrl = product?.image?.url || 'default-image-url';

  const decrementQuantite = () => {
    if (quantite > 1) {
      setQuantite(quantite - 1);
      decrementQuantity(product);
    }
  };

  const incrementQuantite = () => {
    setQuantite(quantite + 1);
    incrementQuantity(product);
  };

  const handleQuantiteChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantite(value);
      const existingItem = cartItems.find((item) => item.product.id === product?.id);
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: value,
        };
        const updatedCartItems = cartItems.map((item) =>
          item.product.id === product?.id ? updatedItem : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
      }
    }
  };

  const isAddedToCart = cartItems.some((item) => item.product.id === product?.id);

  const handleAddToCart = () => {
    addToCart(product, quantite);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product);
  };

  if (error) {
    return <div>Error loading product. Please try again laterez.</div>;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrapper-content">
      <Container>
        <Row>
          <Col md={7}>
            {imageUrl !== 'default-image-url' ? (
              <img src={'https://akata-marketplace.goavana.com/' + product?.image?.url} alt={product.title} />
            ) : (
              <div></div>
            )}
          </Col>
          <Col md={5}>
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <p>
              <b>{product.price} Ar</b>
            </p>

            <div>
              <div>
                <Button onClick={decrementQuantite} disabled={isAddedToCart}>-</Button>
                <input
                  type="number"
                  min="1"
                  value={quantite}
                  onChange={handleQuantiteChange}
                  autoComplete="off"
                />
                <Button onClick={incrementQuantite} disabled={isAddedToCart}>+</Button>
              </div>

              <div>
                {isAddedToCart ? (
                  <button onClick={handleRemoveFromCart}>
                    Retirer du panier
                  </button>
                ) : (
                  <button onClick={handleAddToCart}>
                    Ajouter au panier
                  </button>
                )}
              </div>
            </div>
          </Col>
        </Row>
        {/* Affichez d'autres détails du produit selon vos besoins */}
      </Container>
    </div>
  );
};

export default SingleProductPage;
