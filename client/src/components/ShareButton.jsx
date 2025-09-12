import React from 'react';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import Tooltip from '@mui/material/Tooltip';

// Кнопка "Поделиться" (копирует ссылку на товар)
const ShareButton = ({ url }) => {
  const [copied, setCopied] = React.useState(false);
  const handleShare = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <Tooltip title={copied ? 'Ссылка скопирована!' : 'Поделиться'}>
      <IconButton onClick={handleShare} color={copied ? 'success' : 'primary'}>
        <ShareIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ShareButton;
