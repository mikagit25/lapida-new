import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const MemorialCard = ({ memorial, onClick }) => {
  return (
    <Card sx={{ maxWidth: 345, cursor: 'pointer', boxShadow: 3 }} onClick={() => onClick && onClick(memorial)}>
      {memorial.profileImage ? (
        <CardMedia
          component="img"
          height="180"
          image={memorial.profileImage}
          alt={memorial.fullName}
        />
      ) : (
        <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
          <svg width="64" height="64" fill="#bbb" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </Box>
      )}
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>{memorial.fullName}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>{memorial.lifespan}</Typography>
        {memorial.epitaph && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
            "{memorial.epitaph}"
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">Просмотров: {memorial.views || 0}</Typography>
          <Typography variant="caption" color="text.secondary">{new Date(memorial.createdAt).toLocaleDateString('ru-RU')}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MemorialCard;
