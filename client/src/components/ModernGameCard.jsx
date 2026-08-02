import React from 'react';
import { Card, CardMedia, Box, Typography, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';

function ModernGameCard({ game }) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        bgcolor: '#0f172a',
        aspectRatio: '3/4',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(25, 118, 210, 0.3)',
          '& .game-image': {
            transform: 'scale(1.1)',
            filter: 'blur(3px) brightness(0.6)',
          },
          '& .play-btn': {
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '& .game-title': {
            transform: 'translateY(-8px)',
          }
        },
      }}
      onClick={() => navigate(`/gameprofile/${game.id}`)}
    >
      <CardMedia
        className="game-image"
        component="img"
        image={game.cover}
        alt={game.name}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      />
      
      {/* Gradient Overlay for Text Readability */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%',
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 40%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content Area */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Typography
          className="game-title"
          variant="h6"
          component="h3"
          sx={{
            color: '#f8fafc',
            fontWeight: 800,
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 4px 12px rgba(0,0,0,0.9)',
            transition: 'transform 0.4s ease',
          }}
        >
          {game.name}
        </Typography>
        {game.rating && game.rating > 0 ? (
          <Typography
            variant="body2"
            sx={{ color: '#94a3b8', mt: 0.5, fontWeight: 600, letterSpacing: '0.5px' }}
          >
            {Math.round(game.rating)}/100 RATING
          </Typography>
        ) : null}
      </Box>

      {/* Center Play Button */}
      <Button
        className="play-btn"
        variant="contained"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.5)',
          opacity: 0,
          minWidth: 0,
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'white',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.5)',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            bgcolor: 'primary.light',
            transform: 'translate(-50%, -50%) scale(1.1) !important',
          }
        }}
      >
        <PlayArrowIcon sx={{ fontSize: 36 }} />
      </Button>
    </Card>
  );
}

export default ModernGameCard;
