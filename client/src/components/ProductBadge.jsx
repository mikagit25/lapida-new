import React from 'react';
import Chip from '@mui/material/Chip';

// Плашка "Новинка" или "Хит" по тегу товара
const ProductBadge = ({ tags = [] }) => {
  if (!tags || tags.length === 0) return null;
  let label = '';
  let color = 'default';
  if (tags.includes('новинка') || tags.includes('new')) {
    label = 'Новинка';
    color = 'success';
  } else if (tags.includes('хит') || tags.includes('hit')) {
    label = 'Хит продаж';
    color = 'warning';
  }
  if (!label) return null;
  return (
    <Chip label={label} color={color} size="small" sx={{ position: 'absolute', top: 8, left: 8, zIndex: 2, fontWeight: 'bold', fontSize: 14 }} />
  );
};

export default ProductBadge;
