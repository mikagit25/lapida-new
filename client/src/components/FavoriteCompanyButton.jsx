import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Tooltip from '@mui/material/Tooltip';

// Кнопка "Добавить компанию в избранное" (локально, без авторизации)
const FavoriteCompanyButton = ({ companyId }) => {
  const [fav, setFav] = useState(() => {
    const favs = JSON.parse(localStorage.getItem('favoriteCompanies') || '[]');
    return favs.includes(companyId);
  });
  const handleToggle = () => {
    let favs = JSON.parse(localStorage.getItem('favoriteCompanies') || '[]');
    if (fav) {
      favs = favs.filter(id => id !== companyId);
    } else {
      favs.push(companyId);
    }
    localStorage.setItem('favoriteCompanies', JSON.stringify(favs));
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

export default FavoriteCompanyButton;
