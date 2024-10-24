import { Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#b0c4de' }}>
      <Paper elevation={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo" width={50} style={{ margin: '1rem' }} />
        <Button style={{ margin: '.5rem' }} color='primary' role='button' onClick={() => navigate('/login')}>
          Get unlimited free storage with Drive
        </Button>
      </Paper>
    </div>
  );
}
 
export default Landing;