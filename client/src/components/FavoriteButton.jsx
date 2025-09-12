import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Tooltip from '@mui/material/Tooltip';

// Кнопка "Добавить в избранное" (локально, без авторизации)
const FavoriteButton = ({ productId }) => {
  const [fav, setFav] = useState(() => {
    const favs = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    return favs.includes(productId);
  });
  const handleToggle = () => {
    let favs = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    if (fav) {
      favs = favs.filter(id => id !== productId);
    } else {
      favs.push(productId);
    }
    localStorage.setItem('favoriteProducts', JSON.stringify(favs));
    setFav(!fav);
  };
  return (
    <Tooltip title={fav ? 'Убрать из избранного' : 'В избранное'}>
      <IconButton onClick={handleToggle} color={fav ? 'error' : 'default'}>
        {fav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;
