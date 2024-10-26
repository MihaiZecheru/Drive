import { Card, CardContent, Typography, CardActions, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';
import { FolderID } from '../database/ID';
import DeleteItemButton from './DeleteItemButton';
import OpenItemButton from './OpenItemButton';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { CirclePicker } from 'react-color';
import Database from '../database/Database';
import useInfoModal from './base/useInfoModal';
import { TFolder } from '../database/types';

interface Props {
  folder: TFolder;
  removeItemCallback: (itemID: FolderID) => void;
}

const FolderCard = ({ folder, removeItemCallback }: Props) => {
  const navigate = useNavigate();
  const showInfoModal = useInfoModal();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [color, setColor] = useState<string>(folder.color);
  const textBoxRef = useRef<HTMLInputElement>(null);
  const [renameFolderModalOpen, setRenameFolderModalOpen] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>(folder.name);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleRenameFolderModalClose = () => {
    setRenameFolderModalOpen(false);
  };

  const handleRightClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const handleRightClickOnName = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setRenameFolderModalOpen(true);
  };

  const changeColor = () => {
    // Change the color of the folder in the database
    Database.SetFolderColor(folder.id, color)
      .catch((error) => {
        console.error(error);
        showInfoModal('Error', 'Could not update color due to internal server error');
      })
      .finally(() => {
        setModalOpen(false);
      });
  };

  const handleRenameSubmit = () => {
    let newName = textBoxRef.current?.value?.trim();
    setRenameFolderModalOpen(false);

    if (!newName?.length) {
      showInfoModal('Error', 'Folder name cannot be empty');
      return;
    }

    const MAX_FOLDER_LENGTH = 255; // max length on windows
    if (newName.length > MAX_FOLDER_LENGTH) {
      showInfoModal('Error', `Folder name must be less than 255 chars but is ${newName.length} chars.`);
      return;
    }

    if (newName === folder.name) return;

    setRenameFolderModalOpen(false);
    Database.RenameFile(folder.id, newName)
      .then(() => setFolderName(newName!))
      .catch((error: Error) => {
        console.error(error);
        showInfoModal('Error', 'Could not rename file due to internal server error');
      });
  };

  useEffect(() => {
    setTimeout(() => {
      if (textBoxRef.current && renameFolderModalOpen) {
        textBoxRef.current.select();
      }
    }, 250);
  }, [renameFolderModalOpen]);

  return (
    // Disable the right click on the rest of the element
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
          onClick={() => navigate(`/folder/${folder.id}`)}
        >
          <FolderIcon sx={{ fontSize: 40, marginRight: 1, color: color }} onContextMenu={handleRightClick} />
          <Tooltip title={folderName} placement="top-start">
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
              {folderName}
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
          <OpenItemButton itemID={folder.id} itemType="folder"></OpenItemButton>
          <DeleteItemButton itemID={folder.id} itemType="folder" removeItemCallback={removeItemCallback}/>
        </CardActions>
      </Card>

      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
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
          <Button onClick={handleModalClose}>Close</Button>
          <Button onClick={changeColor} autoFocus>Change</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={renameFolderModalOpen}
        onClose={handleRenameFolderModalClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          component: 'div',
          style: { width: '300px' }
        }}
      >
        <DialogTitle>Rename Folder</DialogTitle>
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
            defaultValue={folderName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRenameSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameFolderModalClose}>Cancel</Button>
          <Button role="button" onClick={handleRenameSubmit}>Rename</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FolderCard;