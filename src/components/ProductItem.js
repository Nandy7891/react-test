import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { CartContext } from "./CartContext";

const ProductItem = ({ product }) => {
  const [quantite, setQuantite] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const {
    cartItems,
    removeFromCart,
    addToCart,
    incrementQuantity,
    decrementQuantity,
  } = useContext(CartContext);

  useEffect(() => {
    const productInCart = cartItems.find(
      (item) => item.product.id === product.id
    );
    setIsAddedToCart(!!productInCart);
    if (productInCart) {
      setQuantite(productInCart.quantity);
    } else {
      setQuantite(1);
    }
  }, [cartItems, product]);

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
      const existingItem = cartItems.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          quantity: value,
        };
        const updatedCartItems = cartItems.map((item) =>
          item.product.id === product.id ? updatedItem : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
      }
    }
  };

  const handleAddToCart = () => {
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      return;
    }

    addToCart(product, quantite);
    setIsAddedToCart(true);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product);
    setIsAddedToCart(false);
  };

  const calculateTotalProd = () => {
    const cartItem = cartItems.find((item) => item.product.id === product.id);
    if (cartItem) {
      return cartItem.product.price * cartItem.quantity;
    }
    return product.price;
  };

  const imageUrl = product?.image?.url || "default-image-url";

  return (
    <Card>
      <div className="product-item-img">
        {imageUrl !== "default-image-url" ? (
          <Card.Img
            variant="top"
            src={"https://akata-marketplace.goavana.com" + imageUrl}
            alt={product.name}
          />
        ) : (
          <div></div>
        )}
        <div className="handle-wrapper">
          {isAddedToCart ? (
            <Button className="handle-button" onClick={handleRemoveFromCart}>
              Retirer au panier
            </Button>
          ) : (
            <Button
              className="handle-button"
              onClick={handleAddToCart}
              disabled={isAddedToCart}
            >
              Ajouter au panier
            </Button>
          )}
        </div>
      </div>
      <Card.Body>
        <Card.Title as="h2">{product.title}</Card.Title>
        <div className="product-description">
          <Card.Text>{product.description}</Card.Text>
        </div>
        <div>
          <Link to={`/product/${product.id}`}><span>Voir plus</span></Link>
        </div>
        <div className="d-flex justify-content-between">
        <div className="price"> {calculateTotalProd(product.id)} <small>Ar</small>
        </div>
        <div className="ar-product d-flex">
          <Button onClick={decrementQuantite} disabled={isAddedToCart}>
            -
          </Button>
          <input
            className="nombre-produit"
            type="number"
            min="1"
            value={quantite}
            onChange={handleQuantiteChange}
            disabled={isAddedToCart}
          />
          <Button onClick={incrementQuantite} disabled={isAddedToCart}>
            +
          </Button>
        </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductItem;
