import { Card, CardContent, Typography, CardActions } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';
import { FolderID } from '../database/ID';
import DeleteItemButton from './DeleteItemButton';
import OpenItemButton from './OpenItemButton';
import { useNavigate } from 'react-router-dom';

interface Props {
  name: string;
  folderID: FolderID;
  removeItemCallback: (itemID: FolderID) => void;
}

const FolderCard = ({ name, folderID, removeItemCallback }: Props) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        maxWidth: '300px',
        width: '300px',
        height: '120px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        backgroundColor: '#f9f9f9',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        className='no-highlight'
        onClick={() => navigate(`/folder/${folderID}`)}
      >
        <FolderIcon sx={{ fontSize: 40, marginRight: 1, color: '#1976d2' }} />
        <Typography
          variant="h6"
          component="div"
          sx={{
            maxWidth: 'calc(100% - 48px)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#f0f0f0',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <OpenItemButton itemID={folderID} itemType="folder"></OpenItemButton>
        <DeleteItemButton itemID={folderID} itemType="folder" removeItemCallback={removeItemCallback}/>
      </CardActions>
    </Card>
  );
};

export default FolderCard;