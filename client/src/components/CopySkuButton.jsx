import React from 'react';
import { Button, Tooltip } from '@mui/material';

// Кнопка для быстрого копирования артикула и названия товара
const CopySkuButton = ({ sku, name }) => {
  const [copied, setCopied] = React.useState(false);
  if (!sku) return null;
  const handleCopy = () => {
    navigator.clipboard.writeText(`${sku} ${name || ''}`.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <Tooltip title={copied ? 'Скопировано!' : 'Скопировать артикул'}>
      <Button
        size="small"
        variant="outlined"
        color={copied ? 'success' : 'primary'}
        onClick={handleCopy}
        sx={{ ml: 1 }}
      >
        {copied ? '✓' : 'Артикул'}
      </Button>
    </Tooltip>
  );
};

export default CopySkuButton;
