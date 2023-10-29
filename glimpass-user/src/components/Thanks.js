import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Paper, TextareaAutosize, Container, Box, Divider } from '@mui/material';

const ThanksComponent = ({ route, stepsWalked, totalSteps }) => {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(''); // State to hold feedback

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!feedback.trim()) {
            window.alert("Feedback is required!");
            return;
        }

        const userId = sessionStorage.getItem('_id');
        console.log("userId",userId);
        try {
            if(userId)
            {const response = await fetch("https://app.glimpass.com/user/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    feedback,
                }),
            });

            if (response.ok) {
                window.alert("Feedback received. Thank you!");
                window.location.href = "/markets";
            } else {
                window.alert("Error submitting feedback. Please try again.");
            }}
        } catch (error) {
            console.error("Error:", error);
            window.alert("Error submitting feedback. Please try again.");
        }
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
                    <Typography variant="h6" align="center">
                        Feedback
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextareaAutosize 
                            minRows={3} 
                            style={{ width: '100%', padding: '8px', borderRadius: '8px', marginTop: '8px' }} 
                            placeholder="Your thoughts..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            required
                        />
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button 
                                type="submit"
                                variant="contained" 
                                color="primary"
                            >
                                Send
                            </Button>
                        </Box>
                    </form>
                </Box>

                <Box display="flex" justifyContent="center" mt={2}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() =>  window.location.href = "/markets"}
                            >
                                Explore Other Shops
                            </Button>
                        </Box>
            </Paper>
        </Container>
    );
}

export default ThanksComponent;
