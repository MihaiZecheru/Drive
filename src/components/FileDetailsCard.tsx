import { Card, CardContent, Typography, CardActions, Tooltip } from '@mui/material';
import {
  Image as ImageIcon,
  Videocam as VideoIcon,
  AudioFile as AudioIcon,
  Code as CodeIcon,
  PictureAsPdf as PdfIcon,
  Description as DefaultFileIcon,
} from '@mui/icons-material';
import DeleteItemButton from './DeleteItemButton';
import { useNavigate } from 'react-router-dom';
import { TFile } from '../database/types';
import DownloadItemButton from './DownloadItemButton';
import { FolderID } from '../database/ID';

interface Props {
  file: TFile;
  /**
   * Typically 300px, but is set to 100% to fit the size of the attachment on the viewFilePage.
   */
  width: '300px' | '100%';
  /**
   * The ID of the user's root folder. Will be null if it hasn't loaded yet.
   */
  userRootFolderID: FolderID | null;
}

const FileDetailsCard = ({ file, width, userRootFolderID }: Props) => {
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
        maxWidth: width,
        minWidth: '300px',
        width: width,
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
        onClick={() => navigate(`/file/${file.id}`)}
      >
        
        { iconCompontent(file.type) }

        <Tooltip title={file.name} placement="top-start">
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
            {file.name}
          </Typography>
        </Tooltip>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#f0f0f0',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <DownloadItemButton file={file}></DownloadItemButton>
        <DeleteItemButton itemID={file.id} itemType="file" removeItemCallback={
          () => {
            if (userRootFolderID && file.folder_id === userRootFolderID)
              navigate('/home');
            else
              navigate(`/folder/${file.folder_id}`)
          }
        }/>
      </CardActions>
    </Card>
  );
};

export default FileDetailsCard;