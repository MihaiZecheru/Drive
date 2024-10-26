import { Card, CardContent, Typography, CardActions, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
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
import { TFile } from '../database/types';
import { CirclePicker } from 'react-color';
import useInfoModal from './base/useInfoModal';
import { createRef, useEffect, useState } from 'react';
import Database from '../database/Database';

interface Props {
  file: TFile;
  /**
   * Custom logic for after the item is removed in the database. Can be used to update the display.
   */
  removeItemCallback: ((itemID: FileID) => void);
}

const FileCard = ({ file, removeItemCallback }: Props) => {
  const navigate = useNavigate();
  const showInfoModal = useInfoModal();
  const [iconColorModalOpen, setModalOpen] = useState<boolean>(false);
  const [color, setColor] = useState<string>(file.color);
  const [renameFileModalOpen, setRenameFileModalOpen] = useState<boolean>(false);
  const textBoxRef = createRef<HTMLInputElement>();
  const [fileName, setFileName] = useState<string>(file.name);

  const handleIconColorModalClose = () => {
    setModalOpen(false);
  };

  const handleRenameFileModalClose = () => {
    setRenameFileModalOpen(false);
  };

  const handleRightClickOnIcon = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleRightClickOnName = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setRenameFileModalOpen(true);
  };

  const changeColor = () => {
    // Change the color of the folder in the database
    Database.SetFileColor(file.id, color)
      .catch((error: Error) => {
        console.error(error);
        showInfoModal('Error', 'Could not update color due to internal server error');
      })
      .finally(() => {
        setModalOpen(false);
      });
  };

  const handleRenameSubmit = () => {
    let newName = textBoxRef.current?.value?.trim();
    setRenameFileModalOpen(false);

    if (!newName?.length) {
      showInfoModal('Error', 'File name cannot be empty');
      return;
    }

    const MAX_FILE_LENGTH = 255; // max length on windows
    if (newName.length > MAX_FILE_LENGTH) {
      showInfoModal('Error', `File name must be less than 255 chars but is ${newName.length} chars.`);
      return;
    }

    if (newName === fileName) return;

    const fileExtension: string = file.name.split('.').length >= 2 ? file.name.split('.').pop()! : '';
    if (!newName.endsWith(fileExtension)) {
      newName += '.' + fileExtension;
    }

    Database.RenameFile(file.id, newName)
      .then(() => setFileName(newName!))
      .catch((error: Error) => {
        console.error(error);
        showInfoModal('Error', 'Could not rename file due to internal server error');
      });
  };

  const iconStyle = { fontSize: 40, marginRight: 1, color: color };

  const iconCompontent = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon sx={iconStyle} onContextMenu={handleRightClickOnIcon} />;
      case 'video':
        return <VideoIcon sx={iconStyle} onContextMenu={handleRightClickOnIcon} />;
      case 'audio':
        return <AudioIcon sx={iconStyle} onContextMenu={handleRightClickOnIcon} />;
      case 'code':
        return <CodeIcon sx={iconStyle} onContextMenu={handleRightClickOnIcon} />;
      case 'pdf':
        return <PdfIcon sx={iconStyle} onContextMenu={handleRightClickOnIcon} />;
      case 'text':
      default:
        return <DefaultFileIcon sx={iconStyle} onContextMenu={handleRightClickOnIcon} />;
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (textBoxRef.current && renameFileModalOpen) {
        textBoxRef.current.select();
      }
    }, 250);
  }, [renameFileModalOpen]);

  return (
    <div onContextMenu={handleRightClickOnName}>
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
          onClick={() => navigate(`/file/${file.id}`)}
        >
          
          { iconCompontent(file.type) }

          <Tooltip title={fileName} placement="top-start">
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
              <span onContextMenu={handleRightClickOnName}>
                {fileName}
              </span>
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
          <OpenItemButton itemID={file.id} itemType="file"></OpenItemButton>
          <DeleteItemButton itemID={file.id} itemType="file" removeItemCallback={removeItemCallback}/>
        </CardActions>
      </Card>

      <Dialog
        open={iconColorModalOpen}
        onClose={handleIconColorModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Set Icon Color
        </DialogTitle>
        <DialogContent>
          <CirclePicker
            color={color}
            onChange={(color) => setColor(color.hex)}
            colors={[
              '#c9c9f5', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#ff4081',
              '#f44336', '#e91e63', '#c62828', '#4caf50', '#8bc34a', '#cddc39',
              '#00bcd4', '#009688', '#03a9f4', '#1976d2', '#3f51b5', '#673ab7',
              '#9c27b0', '#795548', '#607d8b', '#9e9e9e', '#388e3c', '#000'
            ]}
            styles={{ default: { card: { marginTop: '1rem' } } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIconColorModalClose}>Close</Button>
          <Button onClick={changeColor} autoFocus>Change</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={renameFileModalOpen}
        onClose={handleRenameFileModalClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          component: 'div',
          style: { width: '300px' }
        }}
      >
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={textBoxRef}
            autoFocus
            autoComplete='off'
            margin="dense"
            id="file-name"
            name="file-name"
            label="File name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={fileName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRenameSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameFileModalClose}>Cancel</Button>
          <Button role="button" onClick={handleRenameSubmit}>Rename</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FileCard;