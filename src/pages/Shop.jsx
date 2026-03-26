import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Shop = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        toast.error('Failed to load products');
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filtering and Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory ? product.category_id === categories.find(c => c.slug === selectedCategory)?.id : true;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "featured") {
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  if (loading) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}><h2>Loading plants...</h2></div>;

  return (
    <section className="section shop-section">
      <div className="container">
        <div className="shop-header-title">
          <h1>Shop plants &amp; more</h1>
        </div>
        
        <div className="shop-layout">
          {/* Sidebar */}
          <aside className="shop-sidebar">
            <div className="filter-form">
              <div className="filter-group">
                <h3>Search</h3>
                <div className="search-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Search plants..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="button" aria-label="Search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="filter-group">
                <h3>Categories</h3>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="category" 
                      value="" 
                      checked={selectedCategory === ""} 
                      onChange={() => setSelectedCategory("")}
                    />
                    <span className="radio-custom"></span>
                    All Categories
                  </label>
                  {categories.map(cat => (
                    <label key={cat.id} className="radio-label">
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat.slug} 
                        checked={selectedCategory === cat.slug} 
                        onChange={() => setSelectedCategory(cat.slug)}
                      />
                      <span className="radio-custom"></span>
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="shop-main">
            <div className="shop-topbar">
              <div className="results-count">
                Showing {filteredProducts.length} items
              </div>
              <div className="shop-sort">
                <label htmlFor="sort-select">Sort by:</label>
                <select 
                  id="sort-select" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="sort-select"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>
            
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <article key={product._id} className="product-card product-card--hover">
                    <div className="product-image" aria-hidden="true">
                      <Link to={`/product/${product._id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                        {product.image_filename ? (
                          <img 
                            src={product.image_filename.startsWith('http') ? product.image_filename : `/images/${product.image_filename}`} 
                            alt={product.name} 
                          />
                        ) : (
                          <div className="image-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', fontSize: '2rem' }}>
                            {product.name[0]}
                          </div>
                        )}
                      </Link>
                    </div>

                    <div className="product-info">
                      <Link to={`/product/${product._id}`}>
                        <h3>{product.name}</h3>
                      </Link>
                      <p className="price">₹{product.price.toFixed(2)}</p>
                    </div>

                    <div className="product-hover">
                      <div className="product-hover-inner">
                        <p className="product-hover-title">{product.name}</p>
                        <p className="product-hover-price">₹{product.price.toFixed(2)}</p>
                        
                        <button 
                          onClick={() => addToCart(product)} 
                          className="btn-primary" 
                          style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem', marginBottom: '0.5rem' }}
                        >
                          Add to Cart
                        </button>
                        
                        <Link 
                          to={`/product/${product._id}`} 
                          className="btn-outline product-hover-btn-outline" 
                          style={{ width: '100%', display: 'inline-flex', justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem', color: 'white', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', textDecoration: 'none' }}
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-products" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0' }}>
                  <p>No products found matching your criteria.</p>
                  <button onClick={() => { setSearch(""); setSelectedCategory(""); }} className="btn-outline" style={{ marginTop: '1rem' }}>Clear Filters</button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Shop;
