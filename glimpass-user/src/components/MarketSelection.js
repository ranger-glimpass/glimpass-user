import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Container } from '@mui/material';

const malls = [
  { id: 1, name: 'Ambience Mall, Gurugram', imageUrl: 'https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/sites/1/2016/05/Exterior_of_Ambi_Mall.jpg?w=1200&h=628&fill=blur&fit=fill' },
  { id: 2, name: 'DLF Promenade, Delhi', imageUrl: 'https://imgmedia.lbb.in/media/2021/03/603c8db2bb3dd9451519351f_1614581170747.jpg' },
  // ... other malls
];

const MarketSelection = () => {
  const navigate = useNavigate();

  const handleCardClick = (mallId) => {
    navigate(`/shops`);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom align="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
        Select a Market
      </Typography>
      <Grid container spacing={2}>
        {malls.map((mall) => (
          <Grid item xs={12} sm={6} md={4} key={mall.id}>
            <Card onClick={() => handleCardClick(mall.id)} elevation={3} style={{ transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = ''}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt={mall.name}
                  height="140"
                  image={mall.imageUrl}
                  style={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" align="center">
                    {mall.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MarketSelection;
