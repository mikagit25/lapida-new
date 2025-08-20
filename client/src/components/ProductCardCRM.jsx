import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/crmService';

const ProductCardCRM = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then(res => {
        setProducts(res.data.list || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Ошибка загрузки товаров');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка товаров...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Товары из CRM</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8, minWidth: 200 }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Цена: {product.price || '—'}</p>
              <AddToCartButton product={product} />
          </div>
        ))}
      </div>
    </div>
  );
import AddToCartButton from './AddToCartButton';
};

export default ProductCardCRM;
