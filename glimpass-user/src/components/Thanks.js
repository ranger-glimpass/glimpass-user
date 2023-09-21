import { useNavigate } from "react-router-dom";
import { Button, Typography, Paper, TextareaAutosize, Container, Box, Divider } from '@mui/material';

const ThanksComponent = ({ route, stepsWalked, totalSteps }) => {
    const navigate = useNavigate();
    
    const handleSubmit = (event) => {
        event.preventDefault();
        window.alert("Feedback received. Thank you!");
        navigate('/shops');
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '24px', borderRadius: '15px' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Thank You!
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary">
                    {stepsWalked}/{totalSteps} steps walked.
                </Typography>

                <Box my={3}>
                    <Divider />
                    <Typography variant="h6" align="center" style={{ marginTop: '16px' }}>
                        Summary
                    </Typography>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {route.map((item, index) => (
                            <li key={index}>
                                <Typography variant="body2" align="center">
                                    {item.direction ? `Turn ${item.direction}, ${item.steps} steps` : `Reached ${item.name}`}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </Box>

                <Box my={3}>
                    <Typography variant="h6" align="center">
                        Feedback
                    </Typography>
                    <form>
                        <TextareaAutosize 
                            minRows={3} 
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', marginTop: '8px' }} 
                            placeholder="Your thoughts..."
                        />
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleSubmit}
                            >
                                Send
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
}

export default ThanksComponent;
