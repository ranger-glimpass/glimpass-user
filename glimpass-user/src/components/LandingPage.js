import React from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box, Container } from '@mui/material';

// Dummy data for the shop
const shopData = {
  id: '1',
  name: 'The Coffee Shop',
  coverImage: 'https://res.cloudinary.com/purnesh/image/upload/w_1080,f_auto/coffee-cover.jpg', // Cover image for the top section
  profileImage: 'https://res.cloudinary.com/purnesh/image/upload/w_1080,f_auto/coffeefeed55-1920-high.jpg', // Square profile image
  categories: ['Cafe', 'Bakery'],
  phone: '+1234567890',
  mapLink: 'https://maps.google.com',
  description: 'A cozy place to enjoy your coffee and pastries.',
  address: '123 Coffee Lane, Beanstown, CA',
  hours: 'Monday - Friday: 8am - 5pm',
  reviews: [
    { id: 1, text: 'Great atmosphere and friendly staff!', rating: 5 },
    { id: 2, text: 'Loved the coffee and pastries.', rating: 4 },
  ]
};

const LandingPage = () => {
  const { id } = useParams();
  const shop = shopData; // Fetch the shop data based on the ID

  if (shop.id !== id) {
    return <Typography variant="h6" align="center">Shop not found</Typography>;
  }

  return (
    <Box>
      <Box style={{
        backgroundImage: `url(${shop.coverImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '250px'
      }} />
      <Container maxWidth="md" style={{ marginTop: '-100px' }}>
        <Paper elevation={3} style={{ padding: '20px', position: 'relative' }}>
          <Box
            component="img"
            src={shop.profileImage}
            alt={shop.name}
            sx={{
              width: '200px',
              height: '200px',
              objectFit: 'contain', // Ensures the whole image is shown without cropping
              borderRadius: '8px',
              position: 'absolute',
              top: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'background.paper' // Adds a background color to fill empty space if the image is not square
            }}
          />
          <Box pt={18} textAlign="center">
            <Typography variant="h4" gutterBottom>{shop.name}</Typography>
            <Typography variant="subtitle1" gutterBottom>{shop.categories.join(', ')}</Typography>
            <Typography variant="body1">Phone: {shop.phone}</Typography>
            <Typography variant="body1">
              Map: <a href={shop.mapLink} target="_blank" rel="noopener noreferrer">View on map</a>
            </Typography>
            <Typography variant="body1">Address: {shop.address}</Typography>
            <Typography variant="body1">Hours: {shop.hours}</Typography>
            <Typography variant="body1">{shop.description}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Reviews</Typography>
            {shop.reviews.map(review => (
              <Typography key={review.id}>{review.text} - Rating: {review.rating}</Typography>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage;
