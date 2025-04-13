import { Link } from "react-router-dom";
import { Container, Box, Typography, Button } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SuccessfulPasswordReset = () => {
  return (
    <Container 
      maxWidth="sm" 
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          p: 4,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white"
        }}
      >
        {/* VMS Logo - Replace with your actual logo component */}
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: "bold", 
            mb: 4,
            color: "#1976d2" // Primary blue color
          }}
        >
          VMS
        </Typography>

        <CheckCircleOutlineIcon 
          sx={{ 
            fontSize: 80, 
            color: "#4caf50", // Success green color
            mb: 3 
          }} 
        />

        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: "medium", 
            mb: 2,
            color: "#333"
          }}
        >
          Successful Password Reset!
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: "#666"
          }}
        >
          Now you can use your new password to Log-in to your account.
        </Typography>

        <Button
          component={Link}
          to="/login"
          variant="contained"
          size="large"
          fullWidth
          sx={{
            py: 1.5,
            fontSize: "1rem",
            backgroundColor: "#1976d2", // Primary blue color
            "&:hover": {
              backgroundColor: "#1565c0" // Darker blue on hover
            }
          }}
        >
          LOGIN
        </Button>
      </Box>
    </Container>
  );
};

export default SuccessfulPasswordReset;