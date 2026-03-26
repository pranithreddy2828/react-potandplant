import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error('Product not found');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}><h2>Loading product...</h2></div>;

  if (!product) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>Product not found</h1>
          <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Back to Shop</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container product-detail-grid">
        <div className="product-detail-image">
          {product.image_filename ? (
            <img 
              src={product.image_filename.startsWith('http') ? product.image_filename : `/images/${product.image_filename}`} 
              alt={product.name} 
            />
          ) : (
            <div className="image-placeholder large">{product.name[0]}</div>
          )}
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price.toFixed(2)}</p>
          <p>{product.description}</p>

          <div className="add-to-cart-form" style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div>
              <label htmlFor="quantity">Quantity</label>
              <input 
                type="number" 
                id="quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
                min="1" 
                className="input"
                style={{ width: '80px', marginLeft: '0.5rem' }}
              />
            </div>
            <button onClick={() => addToCart(product, quantity)} className="btn-primary">Add to cart</button>
          </div>

          {product.care_instructions && (
            <div className="care-box">
              <h2>Care instructions</h2>
              <p>{product.care_instructions}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
