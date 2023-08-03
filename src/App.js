import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./Home";
import Footer from "./footer";
import ProductList from "./components/ProductList";
import SingleProductPage from "./components/SingleProductPage";
import Panier from "./components/Panier";
import Nav from "./components/Nav";
import { Container } from "react-bootstrap";
import {CartProvider} from './components/CartContext'
import Cart from "./components/Card";

function App() {
  return (
    <CartProvider>

    <div>
      <Nav />
      <Container>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/ProductList" element={<ProductList />} />
          <Route path="/product/:productId" element={<SingleProductPage  />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Container>
      <Footer />
    </div>
    </CartProvider>

  );
}

export default App;
