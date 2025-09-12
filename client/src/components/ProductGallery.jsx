import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

// Галерея фото товара с увеличением (lightbox) и миниатюрами
const ProductGallery = ({ images = [], alt = '' }) => {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  if (!images || images.length === 0) return null;

  const handleOpen = idx => {
    setActiveIdx(idx);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
        <img
          src={images[activeIdx]}
          alt={alt}
          style={{ width: '100%', maxWidth: 320, height: 180, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', boxShadow: '0 2px 8px #0002' }}
          onClick={() => handleOpen(activeIdx)}
        />
        {images.length > 1 && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {images.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt={alt + ' ' + (idx + 1)}
                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: idx === activeIdx ? '2px solid #1976d2' : '1px solid #ccc', cursor: 'pointer' }}
                onClick={() => setActiveIdx(idx)}
              />
            ))}
          </Box>
        )}
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: 'relative', p: 0, background: '#111' }}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
            <img
              src={images[activeIdx]}
              alt={alt}
              style={{ maxWidth: '90vw', maxHeight: '70vh', objectFit: 'contain', borderRadius: 8 }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductGallery;
