import React from 'react';
import { Button, Tooltip } from '@mui/material';

// Кнопка для быстрого заказа по телефону (копирует артикул и название, показывает номер)
const QuickOrderButton = ({ sku, name, phone = '+7 (999) 123-45-67' }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(`${sku || ''} ${name || ''} ${phone || ''}`.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <Tooltip title={copied ? 'Данные скопированы!' : `Скопировать для заказа по телефону ${phone}`}>
      <Button
        size="small"
        variant="contained"
        color={copied ? 'success' : 'secondary'}
        onClick={handleCopy}
        sx={{ ml: 1 }}
      >
        {copied ? '✓' : `Заказать: ${phone}`}
      </Button>
    </Tooltip>
  );
};

export default QuickOrderButton;
