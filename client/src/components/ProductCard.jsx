import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <Card sx={{ maxWidth: 345, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {product.images && product.images.length > 0 ? (
        <CardMedia
          component="img"
          height="180"
          image={product.images[0]}
          alt={product.name}
        />
      ) : (
        <CardMedia
          component="div"
          sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', fontSize: 48, color: '#bbb' }}
        >🛒</CardMedia>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>{product.name}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>{product.category}</Typography>
        {/* Теги товара */}
        {product.tags && product.tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
            {product.tags.map((tag, idx) => (
              <Chip key={idx} label={tag} size="small" color="info" />
            ))}
          </Stack>
        )}
        {/* Рейтинг товара */}
        <Rating name="product-rating" value={product.rating || 0} precision={0.5} readOnly sx={{ mb: 1 }} />
        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
          {product.price ? product.price + ' ₽' : 'Цена не указана'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>{product.description}</Typography>
        {product.companyName && (
          <Typography variant="caption" color="text.secondary" component={Link} to={`/companies/${product.companyId}`} sx={{ textDecoration: 'none', color: 'blue' }}>
            {product.companyName}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
        <Button component={Link} to={`/products/${product.slug}`} variant="contained" color="primary" fullWidth>
          Просмотреть товар
        </Button>
        {(onEdit || onDelete) && (
          <div style={{ display: 'flex', gap: 8 }}>
            {onEdit && (
              <Button variant="contained" color="warning" size="small" onClick={onEdit}>Редактировать</Button>
            )}
            {onDelete && (
              <Button variant="contained" color="error" size="small" onClick={onDelete}>Удалить</Button>
            )}
          </div>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
