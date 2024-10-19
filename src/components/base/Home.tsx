import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../../styles/Home.css';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Home = () => {
  return (
    <div className="home">
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
        }}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          onChange={(event: any) => console.log(event.target.files)}
          multiple
        />
      </Button>
    </div>
  );
}
 
export default Home;