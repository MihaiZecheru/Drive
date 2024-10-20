import { Card, CardContent, Typography, CardActions } from '@mui/material';
import {
  Image as ImageIcon,
  Videocam as VideoIcon,
  AudioFile as AudioIcon,
  Code as CodeIcon,
  PictureAsPdf as PdfIcon,
  Description as DefaultFileIcon,
} from '@mui/icons-material';
import { FileID } from '../database/ID';
import DeleteItemButton from './DeleteItemButton';
import OpenItemButton from './OpenItemButton';
import { useNavigate } from 'react-router-dom';
import { TFileType } from '../database/types';

interface Props {
  name: string;
  fileID: FileID;
  fileType: TFileType;
  removeItemCallback: (itemID: FileID) => void;
}

const FileCard = ({ name, fileID, fileType, removeItemCallback }: Props) => {
  const navigate = useNavigate();

  const iconStyle = { fontSize: 40, marginRight: 1, color: '#1976d2' };

  const iconCompontent = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon sx={iconStyle} />;
      case 'video':
        return <VideoIcon sx={iconStyle} />;
      case 'audio':
        return <AudioIcon sx={iconStyle} />;
      case 'code':
        return <CodeIcon sx={iconStyle} />;
      case 'pdf':
        return <PdfIcon sx={iconStyle} />;
      default:
        return <DefaultFileIcon sx={iconStyle} />;
    }
  }

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
        onClick={() => navigate(`/file/${fileID}`)}
      >
        
        { iconCompontent(fileType) }

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
        <OpenItemButton itemID={fileID} itemType="file"></OpenItemButton>
        <DeleteItemButton itemID={fileID} itemType="file" removeItemCallback={removeItemCallback}/>
      </CardActions>
    </Card>
  );
};

export default FileCard;