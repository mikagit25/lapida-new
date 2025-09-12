import React from 'react';
import Typography from '@mui/material/Typography';

// Компонент для отображения цены с акцией/скидкой
const ProductPrice = ({ price, oldPrice, currency = '₽' }) => {
  if (!price && !oldPrice) return <Typography color="text.secondary">Цена не указана</Typography>;
  const hasDiscount = oldPrice && oldPrice > price;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {hasDiscount && (
        <Typography variant="body2" color="error" sx={{ textDecoration: 'line-through', opacity: 0.7 }}>
          {oldPrice} {currency}
        </Typography>
      )}
      <Typography variant="subtitle1" color={hasDiscount ? 'success.main' : 'primary'} sx={{ fontWeight: 'bold', fontSize: 20 }}>
        {price} {currency}
      </Typography>
      {hasDiscount && (
        <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold', ml: 1 }}>
          -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
        </Typography>
      )}
    </div>
  );
};

export default ProductPrice;
