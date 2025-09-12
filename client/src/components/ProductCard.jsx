import React from 'react';
import CopySkuButton from './CopySkuButton';
import QuickOrderButton from './QuickOrderButton';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ProductGallery from './ProductGallery';
import ProductBadge from './ProductBadge';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import ProductPrice from './ProductPrice';
import ProductReviews from './ProductReviews';
import FavoriteButton from './FavoriteButton';
import ShareButton from './ShareButton';
import SimilarProducts from './SimilarProducts';

const ProductCard = ({ product, onEdit, onDelete }) => {
  // Универсальная функция покупки
  const handleBuy = () => {
    if (!product) return;
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const exists = cartItems.find(item => item.productId === product._id);
    if (exists) {
      exists.quantity = (exists.quantity || 1) + 1;
    } else {
      cartItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        companyId: product.companyId,
        images: product.images,
        slug: product.slug
      });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.location.href = '/checkout';
  };
  return (
    <Card sx={{ maxWidth: 345, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative' }}>
        <ProductBadge tags={product.tags} />
        {product.images && product.images.length > 0 ? (
          <ProductGallery images={product.images} alt={product.name} />
        ) : (
          <CardMedia
            component="div"
            sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', fontSize: 48, color: '#bbb' }}
          >🛒</CardMedia>
        )}
      </div>
      <CardContent sx={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'space-between' }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>{product.name}</Typography>
          <FavoriteButton productId={product._id} />
          <ShareButton url={window.location.origin + '/products/' + product.slug} />
        </div>
        <Typography variant="body2" color="text.secondary" noWrap>{product.category}</Typography>
        {product.sku && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography variant="body2" color="text.secondary">Артикул: {product.sku}</Typography>
            <CopySkuButton sku={product.sku} name={product.name} />
            <QuickOrderButton sku={product.sku} name={product.name} />
          </div>
        )}
        {product.quantity !== undefined && (
          <Typography variant="body2" color="text.secondary">Остаток: {product.quantity}</Typography>
        )}
        {product.unit && (
          <Typography variant="body2" color="text.secondary">Ед. изм.: {product.unit}</Typography>
        )}
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
  <ProductPrice price={product.price} oldPrice={product.oldPrice} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>{product.description}</Typography>
        {product.companyName && (
          <Typography variant="caption" color="text.secondary" component={Link} to={`/companies/${product.companyId}`} sx={{ textDecoration: 'none', color: 'blue' }}>
            {product.companyName}
          </Typography>
        )}
      </CardContent>
  <ProductReviews reviews={product.reviews} />
  {/* <SimilarProducts product={product} /> -- убрано для страницы компании */}
  <CardActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
        <Button component={Link} to={`/products/${product.slug}`} variant="contained" color="primary" fullWidth>
          Просмотреть товар
        </Button>
        <Button variant="contained" color="success" fullWidth onClick={handleBuy} sx={{ mt: 1 }}>
          Купить
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
