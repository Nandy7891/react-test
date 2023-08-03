import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import { Container,Row ,Col} from 'react-bootstrap';
import { Link } from "react-router-dom";


const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://akata-marketplace.goavana.com/products?_start=0&_limit=10&_sort=created_at:desc')
      .then(response => response.json())
      .then(data => {
        // Vérifier si les données sont un tableau
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Les données renvoyées ne sont pas un tableau.');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données de l API:', error);
      });
  }, []);

  return (

    <div className="wrapper-content py-5 my-5">
       <Container>
      <h1 className='py-4'>Liste des produits</h1>
        <Row>
          {products.map(product => (     
             <Col md={3}>       
              <ProductItem key={product.id} product={product}/>
            </Col>
          ))}
        </Row>
        
          <div className='my-4 text-center btn-panier'>
            <Link className='px-2' to="/panier">Voir Panier</Link>
          </div>
      </Container>
    </div>
  );
};

export default ProductList;