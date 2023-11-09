import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Container } from '@mui/material';
import glimpassLogo from "../assets/glimpassLogo.png"
const malls = [
  { id: 1, name: 'Ambience Mall, Gurugram', imageUrl: 'https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/sites/1/2016/05/Exterior_of_Ambi_Mall.jpg?w=1200&h=628&fill=blur&fit=fill' },
  { id: 2, name: 'New friends colony', imageUrl: 'https://i.ytimg.com/vi/VV-r81_uVs0/maxresdefault.jpg' },
  { id: 3, name: 'Airia Mall, Gurugram', imageUrl: "https://scontent.flko7-3.fna.fbcdn.net/v/t39.30808-6/325931988_5881934491853200_7104857377601345440_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=FHrk7Is0mn0AX9xZsoR&_nc_ht=scontent.flko7-3.fna&oh=00_AfCY7BCFPWHAEhFHRDPSiIdI5V4EOeB3HT5lhsZFjmyjhw&oe=654CA49B"}
 
   // ... other malls
];

const MarketSelection = () => {
  const navigate = useNavigate();

  const handleCardClick = (marketName) => {
    navigate("/shops", {
      state: {
        market: marketName
      }
  });
};

return (
  <Container style={{ padding: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
      <img src={glimpassLogo} alt="Logo" style={{ maxWidth: '150px', height: 'auto' }} />
    </div>
    
    <Typography variant="h4" component="h1" gutterBottom align="center" style={{ marginBottom: '20px', fontWeight: 300, letterSpacing: '0.05em', color: '#333' }}>
      Select a Market
    </Typography>

    <Grid container spacing={3}>
      {malls.map((mall) => (
        <Grid item xs={12} sm={6} md={4} key={mall.id}>
          <Card 
            onClick={() => handleCardClick(mall.name)} 
            elevation={3} 
            style={{ transition: '0.3s', borderRadius: '10px' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = ''}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                alt={mall.name}
                height="140"
                image={mall.imageUrl}
                style={{ objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" align="center" style={{ fontWeight: 400 }}>
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
