import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

// Пример компонента отзывов для карточки товара
const ProductReviews = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Пока нет отзывов</Typography>;
  }
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Отзывы покупателей</Typography>
      {reviews.map((r, idx) => (
        <Box key={idx} sx={{ mb: 1.5, p: 1, borderRadius: 1, background: '#f7f7fa' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={r.rating || 0} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">{r.author || 'Аноним'}</Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 0.5 }}>{r.text}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ProductReviews;
